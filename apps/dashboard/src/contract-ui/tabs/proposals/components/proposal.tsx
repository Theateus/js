import {
  useCanExecuteProposal,
  useCastVoteMutation,
  useExecuteProposalMutation,
  useHasVotedOnProposal,
  useTokensDelegated,
} from "@3rdweb-sdk/react/hooks/useVote";
import { Flex, Icon } from "@chakra-ui/react";
import { ProposalState, type Vote, type VoteType } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useCallback } from "react";
import { FiCheck, FiMinus, FiX } from "react-icons/fi";
import type { ProposalItem } from "thirdweb/extensions/vote";
import { Button, Card, Text } from "tw-components";

interface IProposalMetadata {
  color: string;
  title: string;
}

const ProposalStateToMetadataMap: Record<ProposalState, IProposalMetadata> = {
  [ProposalState.Pending]: {
    // Vote hasnt started yet
    color: "gray.500",
    title: "Pending",
  },
  [ProposalState.Active]: {
    // Vote is ongoing
    color: "primary.500",
    title: "Active",
  },
  [ProposalState.Canceled]: {
    // Proposal cancelled before vote was closed
    color: "red.500",
    title: "Canceled",
  },
  [ProposalState.Defeated]: {
    // Proposal was defeated
    color: "red.500",
    title: "Defeated",
  },
  [ProposalState.Succeeded]: {
    // Proposal was successful
    color: "green.500",
    title: "Succeeded",
  },
  [ProposalState.Queued]: {
    // Proposal execution transaction is pending
    color: "yellow.500",
    title: "Queued",
  },
  [ProposalState.Expired]: {
    // Proposal expired?
    color: "gray.500",
    title: "Expired",
  },
  [ProposalState.Executed]: {
    // Proposal has been executed
    color: "green.500",
    title: "Executed",
  },
};

interface IProposal {
  proposal: ProposalItem;
  contract?: Vote;
}

export const Proposal: React.FC<IProposal> = ({ proposal, contract }) => {
  const { data: hasVoted, isLoading: hasVotedLoading } = useHasVotedOnProposal(
    contract,
    proposal.proposalId.toString(),
  );
  const { data: canExecute } = useCanExecuteProposal(
    contract,
    proposal.proposalId.toString(),
  );
  const { data: delegated } = useTokensDelegated(contract);
  const { mutate: execute, isLoading: isExecuting } =
    useExecuteProposalMutation(contract, proposal.proposalId.toString());
  const {
    mutate: vote,
    isLoading: isVoting,
    variables,
  } = useCastVoteMutation(contract, proposal.proposalId.toString());

  const { onSuccess: castVoteSuccess, onError: castVoteError } =
    useTxNotifications("Vote cast successfully", "Error casting vote");

  const castVote = useCallback(
    (voteType: VoteType) => {
      vote(
        { voteType },
        {
          onSuccess: castVoteSuccess,
          onError: castVoteError,
        },
      );
    },
    [castVoteError, castVoteSuccess, vote],
  );

  const { onSuccess: executeSuccess, onError: executeError } =
    useTxNotifications(
      "Proposal executed successfully",
      "Error executing proposal",
    );

  const executeProposal = useCallback(() => {
    execute(undefined, {
      onSuccess: executeSuccess,
      onError: executeError,
    });
  }, [execute, executeError, executeSuccess]);

  return (
    <Card key={proposal.proposalId.toString()}>
      <Flex mb="8px">
        <Flex
          paddingY="0px"
          paddingX="16px"
          borderRadius="25px"
          // @ts-expect-error todo fix this
          bg={ProposalStateToMetadataMap[proposal.state].color}
        >
          <Text color="white">
            {/* @ts-expect-error todo fix this */}
            {ProposalStateToMetadataMap[proposal.state].title}
          </Text>
        </Flex>
      </Flex>
      <Text>
        <strong>Proposal:</strong> {proposal.description}
      </Text>
      <Text>
        <strong>Proposed By: </strong>
        {proposal.proposer}
      </Text>

      {(proposal.votes.for > 0n ||
        proposal.votes.against > 0n ||
        proposal.votes.abstain > 0n) && (
        <>
          <Text mt="16px">
            <strong>For:</strong> {proposal.votes.for.toString()}
          </Text>
          <Text>
            <strong>Against:</strong> {proposal.votes.against.toString()}
          </Text>
          <Text>
            <strong>Abstained:</strong> {proposal.votes.abstain.toString()}
          </Text>
        </>
      )}

      {proposal.state === ProposalState.Active &&
      !hasVoted &&
      !hasVotedLoading &&
      delegated ? (
        <Flex mt="24px" gap={2}>
          <TransactionButton
            size="sm"
            transactionCount={1}
            rightIcon={<Icon as={FiCheck} />}
            onClick={() => castVote(1)}
            colorScheme="green"
            isDisabled={isVoting && variables?.voteType !== 1}
            isLoading={isVoting && variables?.voteType === 1}
          >
            Approve
          </TransactionButton>
          <TransactionButton
            size="sm"
            transactionCount={1}
            rightIcon={<Icon as={FiX} />}
            onClick={() => castVote(0)}
            colorScheme="red"
            isDisabled={isVoting && variables?.voteType !== 0}
            isLoading={isVoting && variables?.voteType === 0}
          >
            Against
          </TransactionButton>
          <TransactionButton
            colorScheme="blackAlpha"
            size="sm"
            transactionCount={1}
            rightIcon={<Icon as={FiMinus} />}
            onClick={() => castVote(2)}
            isDisabled={isVoting && variables?.voteType !== 2}
            isLoading={isVoting && variables?.voteType === 2}
          >
            Abstain
          </TransactionButton>
        </Flex>
      ) : (
        canExecute && (
          <Button
            colorScheme="primary"
            size="sm"
            leftIcon={<Icon as={FiCheck} />}
            onClick={executeProposal}
            isLoading={isExecuting}
            mt="24px"
          >
            Execute
          </Button>
        )
      )}
    </Card>
  );
};

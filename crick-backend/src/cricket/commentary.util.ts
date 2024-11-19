import { BallOutcomeDto } from './dtos/ball-outcome.dto';

export function generateCommentary(
  outcome: BallOutcomeDto,
  bowler: string,
  batsman: string
): string {
  const descriptions: string[] = [];
  let runsDescription = "";

  if (outcome.isWicket) {
    descriptions.push(`WICKET! ${batsman} ${outcome.wicketType || "is out"}`);
    if (outcome.fielder) {
      descriptions.push(`c ${outcome.fielder}`);
    }
  } else {
    if (outcome.extras.includes("wide")) {
      runsDescription = `Wide${outcome.runs ? ` +${outcome.runs}` : ""}`;
    } else if (outcome.extras.includes("noball")) {
      runsDescription = `No ball${outcome.runs ? ` +${outcome.runs}` : ""}`;
      if (outcome.extras.includes("bye")) {
        runsDescription += ` (bye)`;
      } else if (outcome.extras.includes("legbye")) {
        runsDescription += ` (leg bye)`;
      }
    } else if (outcome.extras.includes("bye")) {
      runsDescription = `${outcome.runs} bye${outcome.runs !== 1 ? "s" : ""}`;
    } else if (outcome.extras.includes("legbye")) {
      runsDescription = `${outcome.runs} leg bye${
        outcome.runs !== 1 ? "s" : ""
      }`;
    } else if (outcome.runs !== null) {
      runsDescription = `${outcome.runs} run${outcome.runs !== 1 ? "s" : ""}`;
    }

    if (outcome.extras.includes("overthrow")) {
      runsDescription += " (with overthrow)";
    }

    if (runsDescription) {
      descriptions.push(runsDescription);
    }
  }

  const currentTime = new Date().toLocaleTimeString();
  return `${currentTime} - ${bowler} to ${batsman}: ${descriptions.join(", ")}`;
}
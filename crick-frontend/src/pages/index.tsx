import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

// Types
interface Player {
  id: number;
  name: string;
}

interface BattingStats {
  id: number;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
}

interface BowlingStats {
  id: number;
  name: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
  economy: number;
}

interface Extras {
  wide: number;
  noball: number;
  legbye: number;
  bye: number;
}

interface MatchState {
  teamName: string;
  opponentTeamName: string;
  battingTeam: string;
  fieldingTeam: string;
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: Extras;
  currentOverRuns: number;
}

interface BallOutcome {
  runs: number | null;
  extras: string[];
  isWicket: boolean;
  wicketType?: string;
  fielder?: string;
}

// Styles
const useStyles = makeStyles({
  container: {
    padding: "16px",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
  },
  formControl: {
    minWidth: 120,
    width: "100%",
  },
  buttonGroup: {
    marginTop: "16px",
  },
  scorecard: {
    padding: "16px",
  },
  commentary: {
    padding: "16px",
    marginTop: "16px",
  },
});

const CricketScorer: React.FC = () => {
  const classes = useStyles();

  // States
  const [matchState, setMatchState] = useState<MatchState>({
    teamName: "",
    opponentTeamName: "",
    battingTeam: "",
    fieldingTeam: "",
    totalRuns: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: {
      wide: 0,
      noball: 0,
      legbye: 0,
      bye: 0,
    },
    currentOverRuns: 0,
  });

  const [players, setPlayers] = useState({
    striker: {} as BattingStats,
    nonStriker: {} as BattingStats,
    bowler: {} as BowlingStats,
  });

  const [currentBall, setCurrentBall] = useState<BallOutcome>({
    runs: null,
    extras: [],
    isWicket: false,
    wicketType: undefined,
    fielder: undefined,
  });

  const [commentary, setCommentary] = useState<string[]>([]);
  const [teams, setTeams] = useState<{ team1: Player[]; team2: Player[] }>({
    team1: [],
    team2: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams and players from backend
  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      try {
        // Replace with actual API endpoint
        const response = await fetch("http://localhost:3001/api/match/teams");
        const data = await response.json();
        setTeams(data);
        setMatchState((prev) => ({
          ...prev,
          teamName: data.team1Name,
          opponentTeamName: data.team2Name,
          battingTeam: data.team1Name,
          fieldingTeam: data.team2Name,
        }));
        setLoading(false);
      } catch (err) {
        setError("Failed to load teams and players");
        setLoading(false);
      }
    };

    fetchTeamsAndPlayers();
  }, []);


  const calculateStrikeRate = (runs: number, balls: number): number => {
    return balls === 0 ? 0 : parseFloat(((runs / balls) * 100).toFixed(2));
  };

  const generateCommentary = (
    outcome: BallOutcome,
    bowler: string,
    batsman: string
  ): string => {
    const descriptions: string[] = [];
    let runsDescription = "";

    if (outcome.isWicket) {
      descriptions.push(`WICKET! ${batsman} ${outcome.wicketType || "is out"}`);
      if (outcome.fielder) {
        descriptions.push(`c ${outcome.fielder}`);
      }
    }

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

    return `${bowler} to ${batsman}: ${descriptions.join(", ")}`;
  };


  const handleBallOutcome = async () => {
    const { runs, extras, isWicket } = currentBall;
    let newMatchState = { ...matchState };
    let newPlayers = { ...players };
    let runsToAdd = runs || 0;
    let countAsBall = true;

    // Wide Ball Logic
    if (extras.includes("wide")) {
      runsToAdd += 1;
      countAsBall = false;
      newMatchState.extras.wide += runsToAdd;
      newPlayers.bowler.runs += runsToAdd;
    }

    // No Ball Logic
    else if (extras.includes("noball")) {
      runsToAdd += 1;
      countAsBall = false;
      newMatchState.extras.noball += 1;
      newPlayers.bowler.runs += runsToAdd;

      if (extras.includes("bye")) {
        newMatchState.extras.bye += runs || 0;
      } else if (extras.includes("legbye")) {
        newMatchState.extras.legbye += runs || 0;
      } else if (runs) {
        newPlayers.striker.runs += runs;
      }

      newPlayers.striker.balls += 1;
    }

    // Bye/Leg Bye Logic
    else if (extras.includes("legbye") || extras.includes("bye")) {
      const extraType = extras.includes("legbye") ? "legbye" : "bye";
      newMatchState.extras[extraType] += runsToAdd;
      newPlayers.striker.balls += 1;
      newPlayers.bowler.balls += 1;
    }

    // Normal Runs Logic
    else if (runs !== null) {
      newPlayers.striker.runs += runsToAdd;
      newPlayers.striker.balls += 1;
      newPlayers.bowler.runs += runsToAdd;
      newPlayers.bowler.balls += 1;

      if (runs === 4) newPlayers.striker.fours += 1;
      if (runs === 6) newPlayers.striker.sixes += 1;
    }

    // Wicket Logic
    if (isWicket && !extras.includes("wide") && !extras.includes("noball")) {
      newMatchState.wickets += 1;
      newPlayers.bowler.wickets += 1;
    }

    // Update match state
    newMatchState.totalRuns += runsToAdd;
    newMatchState.currentOverRuns += runsToAdd;

    if (countAsBall) {
      newMatchState.balls += 1;
      if (newMatchState.balls === 6) {
        if (newMatchState.currentOverRuns === 0) {
          newPlayers.bowler.maidens += 1;
        }
        newPlayers.bowler.overs += 1;
        newMatchState.overs += 1;
        newMatchState.balls = 0;
        newMatchState.currentOverRuns = 0;
        newPlayers.bowler.balls = 0;
      }
    }

    // Update player stats
    newPlayers.striker.strikeRate = calculateStrikeRate(
      newPlayers.striker.runs,
      newPlayers.striker.balls
    );
    newPlayers.bowler.economy = parseFloat(
      (
        newPlayers.bowler.runs /
        (newPlayers.bowler.overs + newPlayers.bowler.balls / 6)
      ).toFixed(2)
    );

    // Rotate strike for odd runs
    if (
      (runsToAdd % 2 === 1 &&
        !extras.includes("wide") &&
        !extras.includes("noball")) ||
      (newMatchState.balls === 0 && newMatchState.overs > 0)
    ) {
      const temp = newPlayers.striker;
      newPlayers.striker = newPlayers.nonStriker;
      newPlayers.nonStriker = temp;
    }

    // Generate and add commentary
    const commentaryText = generateCommentary(
      currentBall,
      newPlayers.bowler.name,
      newPlayers.striker.name
    );

    // Update states
    setMatchState(newMatchState);
    setPlayers(newPlayers);
    setCommentary((prev) => [commentaryText, ...prev]);
    setCurrentBall({ runs: null, extras: [], isWicket: false });

    // Send ball data to backend
    try {
      await fetch("http://localhost:3001/api/match/ball", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchState: newMatchState,
          players: newPlayers,
          ballOutcome: currentBall,
          commentary: commentaryText,
        }),
      });
    } catch (err) {
      setError("Failed to save ball data");
    }
  };

  if (loading) {
    return (
      <div className={classes.container}>
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" variant="filled">
        {error}
      </Alert>
    );
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className={classes.scorecard}>
            <Typography variant="h5" gutterBottom>
              Scoring Controls
            </Typography>
            <Grid container spacing={2}>
              {/* Striker */}
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Striker</InputLabel>
                  <Select
                    value={players.striker.id || ""}
                    onChange={(e) => {
                      const player = teams.team1.find(
                        (p) => p.id === Number(e.target.value)
                      );
                      if (player) {
                        setPlayers((prev) => ({
                          ...prev,
                          striker: {
                            ...player,
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0,
                            strikeRate: 0,
                          },
                        }));
                      }
                    }}
                    label="Striker"
                  >
                    {teams.team1.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Non-Striker */}
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Non-Striker</InputLabel>
                  <Select
                    value={players.nonStriker.id || ""}
                    onChange={(e) => {
                      const player = teams.team1.find(
                        (p) => p.id === Number(e.target.value)
                      );
                      if (player) {
                        setPlayers((prev) => ({
                          ...prev,
                          nonStriker: {
                            ...player,
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0,
                            strikeRate: 0,
                          },
                        }));
                      }
                    }}
                    label="Non-Striker"
                  >
                    {teams.team1.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Bowler */}
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Bowler</InputLabel>
                  <Select
                    value={players.bowler.id || ""}
                    onChange={(e) => {
                      const player = teams.team2.find(
                        (p) => p.id === Number(e.target.value)
                      );
                      if (player) {
                        setPlayers((prev) => ({
                          ...prev,
                          bowler: {
                            ...player,
                            overs: 0,
                            balls: 0,
                            runs: 0,
                            wickets: 0,
                            maidens: 0,
                            economy: 0,
                          },
                        }));
                      }
                    }}
                    label="Bowler"
                  >
                    {teams.team2.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Runs Buttons */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">Runs</Typography>
                <Grid container spacing={1}>
                  {[0, 1, 2, 3, 4, 6].map((run) => (
                    <Grid item key={run}>
                      <Button
                        variant={
                          currentBall.runs === run ? "contained" : "outlined"
                        }
                        color="primary"
                        onClick={() =>
                          setCurrentBall((prev) => ({ ...prev, runs: run }))
                        }
                      >
                        {run}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {/* Extras Buttons */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">Extras</Typography>
                <Grid container spacing={1}>
                  {["wide", "noball", "bye", "legbye", "overthrow"].map(
                    (extra) => (
                      <Grid item key={extra}>
                        <Button
                          variant={
                            currentBall.extras.includes(extra)
                              ? "contained"
                              : "outlined"
                          }
                          color="secondary"
                          onClick={() => {
                            setCurrentBall((prev) => ({
                              ...prev,
                              extras: prev.extras.includes(extra)
                                ? prev.extras.filter((e) => e !== extra)
                                : [...prev.extras, extra],
                            }));
                          }}
                        >
                          {extra}
                        </Button>
                      </Grid>
                    )
                  )}
                </Grid>
              </Grid>
              {/* Wicket Button */}
              <Grid item xs={12}>
                <Button
                  variant={currentBall.isWicket ? "contained" : "outlined"}
                  color="error"
                  onClick={() =>
                    setCurrentBall((prev) => ({
                      ...prev,
                      isWicket: !prev.isWicket,
                    }))
                  }
                  fullWidth
                >
                  Wicket
                </Button>
              </Grid>
              {/* Wicket Type */}
              {currentBall.isWicket && (
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel>Wicket Type</InputLabel>
                    <Select
                      value={currentBall.wicketType || ""}
                      onChange={(e) =>
                        setCurrentBall((prev) => ({
                          ...prev,
                          wicketType: e.target.value as string,
                        }))
                      }
                      label="Wicket Type"
                    >
                      {[
                        "bowled",
                        "caught",
                        "lbw",
                        "run out",
                        "stumped",
                        "hit wicket",
                        "handled ball",
                      ].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBallOutcome}
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Scorecard */}
          <Paper elevation={3} className={classes.scorecard}>
            <Typography variant="h5" gutterBottom>
              Scorecard
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {matchState.battingTeam} (Batting)
                </Typography>
                <Typography>
                  {matchState.totalRuns}/{matchState.wickets} &nbsp; Overs:{" "}
                  {matchState.overs}.{matchState.balls}
                </Typography>
                <Typography>
                  Extras: W{matchState.extras.wide}, NB
                  {matchState.extras.noball}, LB{matchState.extras.legbye}, B
                  {matchState.extras.bye}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Batsman</TableCell>
                      <TableCell>Runs</TableCell>
                      <TableCell>Balls</TableCell>
                      <TableCell>4s</TableCell>
                      <TableCell>6s</TableCell>
                      <TableCell>SR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[players.striker, players.nonStriker].map((batsman) => (
                      <TableRow key={batsman.id}>
                        <TableCell>{batsman.name}</TableCell>
                        <TableCell>{batsman.runs}</TableCell>
                        <TableCell>{batsman.balls}</TableCell>
                        <TableCell>{batsman.fours}</TableCell>
                        <TableCell>{batsman.sixes}</TableCell>
                        <TableCell>{batsman.strikeRate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Bowler</Typography>
                <Typography>
                  {players.bowler.name} - {players.bowler.overs}.
                  {players.bowler.balls} overs, {players.bowler.runs} runs,{" "}
                  {players.bowler.wickets} wickets, Economy:{" "}
                  {players.bowler.economy}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          {/* Commentary */}
          <Paper elevation={3} className={classes.commentary}>
            <Typography variant="h5" gutterBottom>
              Commentary
            </Typography>
            {commentary.map((text, index) => (
              <Typography key={index} variant="body2">
                {text}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default CricketScorer;

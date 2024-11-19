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
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

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
  striker: BattingStats;
  nonStriker: BattingStats;
  bowler: BowlingStats;
  commentary: string[];
}

interface BallOutcome {
  runs: number | null;
  extras: string[];
  isWicket: boolean;
  wicketType?: string;
  fielder?: string;
}


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
    marginBottom: "16px",
  },
  commentary: {
    padding: "16px",
    marginTop: "16px",
    backgroundColor: "#e0f7fa",
  },
  commentaryText: {
    color: "#00796b",
  },
  batsmanOnStrike: {
    fontWeight: "bold",
    color: "#d32f2f",
  },
  batsman: {
    color: "#1976d2",
  },
  bowler: {
    color: "#388e3c",
  },
  extras: {
    color: "#f57c00",
  },
});

const CricketScorer: React.FC = () => {
  const classes = useStyles();
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
    striker: {} as BattingStats,
    nonStriker: {} as BattingStats,
    bowler: {} as BowlingStats,
    commentary: [],
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

  // Fetched mock teams and players from backend for now
  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      try {
        const response = await fetch("http://localhost:3001/teams");
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

  // Fetch the latest match state from backend
  useEffect(() => {
    const fetchLatestMatchState = async () => {
      try {
        const response = await fetch("http://localhost:3001/cricket/latest");
        const updatedMatchState = await response.json();
        setMatchState(updatedMatchState);
        setCommentary(updatedMatchState.commentary);
      } catch (err) {
        setMatchState({
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
          striker: {} as BattingStats,
          nonStriker: {} as BattingStats,
          bowler: {} as BowlingStats,
          commentary: [],
        })
      }
    };

    fetchLatestMatchState();
  }, []);

  const handleBallOutcome = async () => {
    try {
      // copy of matchState without _id fields
      const matchStateCopy = JSON.parse(JSON.stringify(matchState));
      delete matchStateCopy._id;
      delete matchStateCopy.extras._id;
      delete matchStateCopy.striker._id;
      delete matchStateCopy.nonStriker._id;
      delete matchStateCopy.bowler._id;

      await fetch("http://localhost:3001/cricket/ball", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchState: matchStateCopy,
          ballOutcome: currentBall,
        }),
      });

      // Fetch match state 
      const response = await fetch("http://localhost:3001/cricket/latest");
      const updatedMatchState = await response.json();
      setMatchState(updatedMatchState);
      setCommentary(updatedMatchState.commentary);
      setCurrentBall({ runs: null, extras: [], isWicket: false });
    } catch (err) {
      setError("Failed to process ball outcome");
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
                    value={matchState.striker.id || ""}
                    onChange={(e) => {
                      const player = teams.team1.find(
                        (p) => p.id === Number(e.target.value)
                      );
                      if (player) {
                        setMatchState((prev) => ({
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
                    value={matchState.nonStriker.id || ""}
                    onChange={(e) => {
                      const player = teams.team1.find(
                        (p) => p.id === Number(e.target.value)
                      );
                      if (player) {
                        setMatchState((prev) => ({
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
                    value={matchState.bowler.id || ""}
                    onChange={(e) => {
                      const player = teams.team2.find(
                        (p) => p.id === Number(e.target.value)
                      );
                      if (player) {
                        setMatchState((prev) => ({
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
                  {matchState.battingTeam} (Batting) vs {matchState.fieldingTeam} (Bowling)
                </Typography>
                <Typography>
                  {matchState.totalRuns}/{matchState.wickets} &nbsp; Overs:{" "}
                  {matchState.overs}.{matchState.balls}
                </Typography>
                <Typography className={classes.extras}>
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
                    {[matchState.striker, matchState.nonStriker].map(
                      (batsman) => (
                        <TableRow key={batsman.id}>
                          <TableCell className={batsman.id === matchState.striker.id ? classes.batsmanOnStrike : classes.batsman}>
                            {batsman.name} {batsman.id === matchState.striker.id && "*"}
                          </TableCell>
                          <TableCell>{batsman.runs}</TableCell>
                          <TableCell>{batsman.balls}</TableCell>
                          <TableCell>{batsman.fours}</TableCell>
                          <TableCell>{batsman.sixes}</TableCell>
                          <TableCell>{batsman.strikeRate}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" className={classes.bowler}>Bowler</Typography>
                <Typography>
                  {matchState.bowler.name} - {matchState.bowler.overs}.
                  {matchState.bowler.balls} overs, {matchState.bowler.runs}{" "}
                  runs, {matchState.bowler.wickets} wickets, Economy:{" "}
                  {matchState.bowler.economy}
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
              <Typography key={index} variant="body2" className={classes.commentaryText}>
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
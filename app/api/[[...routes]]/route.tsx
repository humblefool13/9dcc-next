/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { createSystem } from "frog/ui";
import { readFileSync } from "fs";
//@ts-ignore
import { runner } from "./update.js";
runner();

const { Image, Text, Box } = createSystem({
  fonts: {
    roboto: [
      {
        name: "Roboto Mono",
        source: "google",
      },
    ],
  },
});

type State = {
  pageNumber: number;
};

function giveIntents(pageNumber: number) {
  if (pageNumber == 1) {
    return [
      <Button value="home" action="/">
        Home
      </Button>,
      <Button value="next" action="/leaderboard">
        Next ➡️
      </Button>,
    ];
  } else if (pageNumber == 20) {
    return [
      <Button value="home" action="/">
        Home
      </Button>,
      <Button value="previous" action="/leaderboard">
        ⬅️ Previous
      </Button>,
    ];
  } else {
    return [
      <Button value="home" action="/">
        Home
      </Button>,
      <Button value="previous" action="/leaderboard">
        ⬅️ Previous
      </Button>,
      <Button value="next" action="/leaderboard">
        Next ➡️
      </Button>,
    ];
  }
}

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  initialState: {
    pageNumber: 1,
  },
});

app.frame("/", (c) => {
  const { deriveState } = c;
  const state = deriveState((previousState) => {
    previousState.pageNumber = 1;
  });
  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          backgroundColor: "#fff",
          width: "100vw",
          height: "100vh",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "50%",
            display: "flex",
            height: "50vh",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Image height="4" width="0" src="/logo.png" />
        </div>
        <div
          style={{
            width: "50%",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Image width="100%" src="/network.png" />
        </div>
      </div>
    ),
    intents: [
      <Button value="leaderboard" action="/leaderboard">
        Leaderboard
      </Button>,
      <Button value="about" action="/about">
        About
      </Button>,
    ],
  });
});

app.frame("/about", (c) => {
  return c.res({
    image: (
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            backgroundColor: "#fff",
            color: "#000000",
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={{ custom: "25px" }}
            height={{ custom: "80%" }}
            width={{ custom: "90%" }}
            fontSize={{ custom: "40px" }}
            backgroundColor={{ custom: "#F2F1F0" }}
            borderStyle="solid"
            borderWidth={{ custom: "2px" }}
            borderColor={{ custom: "#000000" }}
            textAlign="center"
          >
            <Text align="center" weight="900" font="roboto">
              INTRODUCING 9DCC NETWORK POINTS AVAILABLE TO ALL 9DCC AND ADMIT
              ONE HOLDERS. BUILDING MEANINGFUL IRL COMMUNITY AND CONNECTIONS
              THROUGH SHARED PASSIONS OF WEB3, FASHION, AND BLOCKCHAIN
              TECHNOLOGY. THIS POINT PROGRAM IS ANOTHER KEY MILESTONE FOR THE
              9DCC BRAND GAMIFYING ALL THINGS 9DCC AND ADMIT ONE.
            </Text>
          </Box>
        </div>
      </div>
    ),
    intents: [
      <Button value="home" action="/">
        Home
      </Button>,
      <Button.Link href="https://www.9dcc.xyz/points?tab=about">
        Visit Site
      </Button.Link>,
    ],
  });
});

function getIndex(pageNumber: number) {
  return -5 + 5 * pageNumber;
}

app.frame("/leaderboard", (c) => {
  const { buttonValue, deriveState } = c;
  const state = deriveState((previousState) => {
    if (buttonValue === "next") previousState.pageNumber++;
    if (buttonValue === "previous") previousState.pageNumber--;
  });
  const fileContent = readFileSync("./lb.txt", {
    encoding: "utf8",
    flag: "r",
  });
  const lines = fileContent.split("\n");
  const linesV2 = lines.map((line) => line.split("~"));
  const linesToShow = linesV2.slice(
    getIndex(state.pageNumber),
    getIndex(state.pageNumber) + 5
  );
  const list = linesToShow.map((line) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        borderStyle: "solid",
        borderWidth: "0px 0px 2px 0px",
        borderColor: "#E5E4E2",
        width: "100%",
        height: "18%",
        fontSize: "25px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", width: "10%" }}>{line[0]}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          width: "70%",
        }}
      >
        <img
          src={line[5]}
          alt={line[3]}
          style={{
            width: "7vw",
            height: "7vw",
            marginRight: "20px",
            borderRadius: "10px",
          }}
        />
        <div>{line[2].toUpperCase()}</div>
      </div>
      <div style={{ textAlign: "center", width: "20%" }}>
        {line[3].replaceAll(",", ".")}
      </div>
    </div>
  ));
  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          height: "100vh",
          width: "100vw",
          padding: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#F2F1F0",
            flexDirection: "column",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "#000000",
            width: "100%",
            padding: "0px 10px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              borderStyle: "solid",
              borderWidth: "0px 0px 2px 0px",
              borderColor: "#000000",
              width: "100%",
              height: "10%",
              fontSize: "20px",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "800",
            }}
          >
            <div style={{ textAlign: "center", width: "10%" }}>RANK</div>
            <div style={{ textAlign: "center", width: "70%" }}>MEMBER</div>
            <div style={{ textAlign: "center", width: "20%" }}>SCORE</div>
          </div>
          {list}
        </div>
      </div>
    ),
    intents: giveIntents(state.pageNumber),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

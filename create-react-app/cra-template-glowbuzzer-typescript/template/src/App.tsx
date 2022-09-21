import * as React from "react"
import {useState} from "react"

import {
    AnalogInputsTile,
    AnalogOutputsTile,
    CartesianDroTile,
    ConnectTile,
    DigitalInputsTile,
    DigitalOutputsTile,
    FeedRateTile,
    GCodeTile,
    GlowbuzzerApp,
    IntegerInputsTile,
    IntegerOutputsTile,
    JogTile,
    PreferencesDialog,
    ToolPathTile
} from "@glowbuzzer/controls"

import {Button} from "antd"

import "antd/dist/antd.min.css"
import "dseg/css/dseg.css"
import styled from "styled-components";

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)}/>
        </div>
    )
}

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgba(128, 128, 128, 0.05);

  * {
    // ensure flex elements can shrink when needed
    min-width: 0;
    min-height: 0;
  }

  .body {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    gap: 20px;

    nav,
    section {
      display: flex;
      flex-direction: column;
      gap: 20px;

      > div {
        background: white;
      }
    }

    nav {
      > div {
        height: inherit;
        min-height: 100px;
      }
    }

    section {
      flex-grow: 1;

      > div:nth-child(2) {
        max-height: 30vh;
      }
    }
  }
`

function App() {
    return (
        <GlowbuzzerApp>
            <StyledApp>
                <PrefsButton/>
                <div className="body">
                    <nav>
                        <ConnectTile/>
                        <JogTile/>
                        <CartesianDroTile/>
                        <FeedRateTile/>
                    </nav>
                    <section>
                        <ToolPathTile/>
                        <GCodeTile/>
                    </section>
                    <nav>
                        <DigitalOutputsTile/>
                        <DigitalInputsTile/>
                        <AnalogOutputsTile/>
                        <AnalogInputsTile/>
                        <IntegerOutputsTile/>
                        <IntegerInputsTile/>
                    </nav>
                </div>
            </StyledApp>
        </GlowbuzzerApp>
    );
}

export default App;

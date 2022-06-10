import styled from "styled-components"

export const StyledWaypointsDiv = styled.div`
    padding: 10px;

    div {
        font-weight: bold;
        color: darkblue;
        cursor: pointer;

        :hover .delete {
            display: inline;
        }
    }

    .delete {
        display: none;
    }
`

export const StyledJogDiv = styled.div`
    .selectors {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 8px 0 0 0;

        > div {
            //margin-bottom: 5px;
        }

        .frame {
            white-space: nowrap;
        }
    }

    .ant-radio-group {
        text-align: center;
        display: block;
    }

    .tab {
        display: none;
    }

    .tab.selected {
        display: block;
    }
`

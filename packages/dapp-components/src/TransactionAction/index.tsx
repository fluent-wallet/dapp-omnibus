import { CSSProperties } from "react";
import { Interface } from '@ethersproject/abi';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20_ABI, ERC721_ABI, ERC1155_ABI } from './abi';
import { TranslationArgs, ReturnDataType, EventList, Translation, TranslationEvent, ReturnType } from './type'

const ERC20_INTERFACE = new Interface(ERC20_ABI);
const ERC721_INTERFACE = new Interface(ERC721_ABI);
const ERC1155_INTERFACE = new Interface(ERC1155_ABI);

const StyleWrap: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px' }
const StyleIcon: CSSProperties = { width: '16px', height: '16px' }

const TokenName = "Unknown";
const TokenIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzMgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Ub2tlbnM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnlLvmnb8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NzUuMDAwMDAwLCAtMzEuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJUb2tlbnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2My4wMDAwMDAsIDE4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik1haW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjA5Mzc5NDEsOS42MTI5NjI4NiBDMTMuODI1MTcwNSw5LjIzMjgzNDcgMTMuMzU0NjM0MSw5LjAwMTM2MzM1IDEyLjg0Nzc5NjcsOSBMNC4xNTUyOTU4Niw5IEMzLjY0NTgzNTIxLDguOTk5MTE2MzYgMy4xNzE5MzgxMiw5LjIzMDg3MDA1IDIuOTAxOTI0ODUsOS42MTI5NjI4NyBMMC4yMjU2MTM1MjcsMTMuNDAxNDg4OCBDLTAuMTE4NTc4MzcxLDEzLjg4NjUyMzggLTAuMDY0NzQ2MDY4OCwxNC41MTMzOTYyIDAuMzU4MzIzMzY0LDE0Ljk0Njg4NyBMNy45Mzc1MjYzNCwyMi43NzE3MTM4IEM4LjIwMjE2NjI4LDIzLjA0NTQxMDcgOC42Njc1Njc0MywyMy4wNzc1NDY0IDguOTc3MDMwNTIsMjIuODQzNDkxNiBDOS4wMDYxNTA3MywyMi44MjE0NjcyIDkuMDMzMjg1MzEsMjIuNzk3NDY4NiA5LjA1ODE4NzY5LDIyLjc3MTcxMzggTDE2LjYzNzM5MDcsMTQuOTQ2ODg3IEMxNy4wNjI4MDQxLDE0LjUxNDg3ODIgMTcuMTE5NjMzNywxMy44ODc5MTQzIDE2Ljc3NzQ3MzIsMTMuNDAxNDg4OCBMMTQuMDkzNzk0MSw5LjYxMjk2Mjg2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiNDNEM2RDIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNi43Nzc2MDcyLDE4LjQ2NTY5MjYgQzI2LjU3MjE4OTIsMTguMTc2ODkzOSAyNi4yMTIzNjczLDE4LjAwMTAzNTggMjUuODI0Nzg1NywxOCBMMTkuMTc3NTc5MiwxOCBDMTguNzg3OTkxNiwxNy45OTkzMjg3IDE4LjQyNTU5OTcsMTguMTc1NDAxMyAxOC4yMTkxMTksMTguNDY1NjkyNiBMMTYuMTcyNTI4LDIxLjM0Mzk4ODIgQzE1LjkwOTMyMjQsMjEuNzEyNDg4OSAxNS45NTA0ODgzLDIyLjE4ODc0OSAxNi4yNzQwMTIsMjIuNTE4MDg5NCBMMjIuMDY5ODczMSwyOC40NjI5MjU0IEMyMi4yNzIyNDQ4LDI4LjY3MDg2NCAyMi42MjgxMzk4LDI4LjY5NTI3ODcgMjIuODY0Nzg4LDI4LjUxNzQ1NzkgQzIyLjg4NzA1NjQsMjguNTAwNzI1MSAyMi45MDc4MDY0LDI4LjQ4MjQ5MjQgMjIuOTI2ODQ5NCwyOC40NjI5MjU0IEwyOC43MjI3MTA1LDIyLjUxODA4OTQgQzI5LjA0ODAyNjYsMjIuMTg5ODc1IDI5LjA5MTQ4NDYsMjEuNzEzNTQ1MiAyOC44Mjk4MzI1LDIxLjM0Mzk4ODIgTDI2Ljc3NzYwNzIsMTguNDY1NjkyNiBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjN0Y4Mjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNTgwOTM0MiwzLjc0NDMxMjcyIEMyNS4yNjQ5MDY1LDMuMjgyNzI4MTEgMjQuNzExMzM0MywzLjAwMTY1NTQ5IDI0LjExNTA1NSwzIEwxMy44ODg1ODM0LDMgQzEzLjI4OTIxNzksMi45OTg5MjcwMSAxMi43MzE2OTE5LDMuMjgwMzQyNDYgMTIuNDE0MDI5MiwzLjc0NDMxMjc0IEw5LjI2NTQyNzY4LDguMzQ0NjY5ODMgQzguODYwNDk2MDMsOC45MzM2NDE0OSA4LjkyMzgyODE1LDkuNjk0ODQ0MzMgOS40MjE1NTY5LDEwLjIyMTIyNjUgTDE4LjMzODI2NjMsMTkuNzIyODEwNiBDMTguNjQ5NjA3NCwyMC4wNTUxNTcxIDE5LjE5NzEzODIsMjAuMDk0MTc5MSAxOS41NjEyMTI0LDE5LjgwOTk2OTUgQzE5LjU5NTQ3MTQsMTkuNzgzMjI1NSAxOS42MjczOTQ1LDE5Ljc1NDA4NDMgMTkuNjU2NjkxNCwxOS43MjI4MTA2IEwyOC41NzM0MDA4LDEwLjIyMTIyNjUgQzI5LjA3Mzg4NzEsOS42OTY2NDM5NSAyOS4xNDA3NDU2LDguOTM1MzI5ODggMjguNzM4MjAzOCw4LjM0NDY2OTgyIEwyNS41ODA5MzQyLDMuNzQ0MzEyNzIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzRDNEY2MCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjAwMDAwMCwgNC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDAwMDAwLCAtNC42MDAwMDApICIgeD0iMTAiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtNC4wMDAwMDAsIC04LjYwMDAwMCkgIiB4PSIwLjUiIHk9IjgiIHdpZHRoPSI3IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5LjI1MDAwMCwgMTUuNjAwMDAwKSByb3RhdGUoNDcuMDAwMDAwKSB0cmFuc2xhdGUoLTE5LjI1MDAwMCwgLTE1LjYwMDAwMCkgIiB4PSIxNyIgeT0iMTUiIHdpZHRoPSI0LjUiIGhlaWdodD0iMS4yIiByeD0iMC42Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgY3g9IjEwIiBjeT0iMC41IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTMiIGN4PSIwLjUiIGN5PSI1IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTQiIGN4PSIxNi41IiBjeT0iMTIuNSIgcj0iMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
const TokenSymbol = "Unknown";
const TokenDecimals = 18;
const Zero = "0x0000000000000000000000000000000000000000";

function shortenAddress(address: string, digits = 4) {
    if (!address) return '';
    return `${address.substring(0, digits + 2)}...${address.substring(address.length - digits)}`;
}

const MethodDataTranslate: Translation = {
    // transfer (ERC20)
    "0xa9059cbb": (arg: TranslationArgs) => {
        const { icon = TokenIcon, symbol = TokenSymbol, decimals = TokenDecimals, data } = arg;
        const parsed = ERC20_INTERFACE.parseTransaction({ data });
        const value = decimals ? formatUnits(parsed.args[1].toString(), decimals) : parsed.args[1].toString();
        return {
            title: 'Transfer',
            args: parsed.args,
            content: <div style={{ ...StyleWrap }}>
                Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} to {shortenAddress(parsed.args[0])}
            </div>
        };
    },
    // transferFrom (ERC20,ERC721)
    "0x23b872dd": (arg: TranslationArgs) => {
        const { icon = TokenIcon, symbol = TokenSymbol, name = TokenName, decimals = TokenDecimals, data } = arg;
        const parsed = ERC20_INTERFACE.parseTransaction({ data });
        const value = decimals ? formatUnits(parsed.args[2].toString(), decimals) : parsed.args[2].toString();
        if (parsed.args[1] === Zero) { // only ERC721
            return {
                title: 'Burn',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Burn {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                </div>
            }
        }
        return {
            title: 'Transfer',
            args: parsed.args,
            content: <div style={{ ...StyleWrap }}>
                Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} to {shortenAddress(parsed.args[1])}
            </div>
        }
    },
    // approve (ERC20)
    "0x095ea7b3": (arg: TranslationArgs) => {
        const { icon = TokenIcon, symbol = TokenSymbol, data } = arg;
        const parsed = ERC20_INTERFACE.parseTransaction({ data });
        if (parsed.args[1].isZero()) {
            return {
                title: 'Revoked',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Revoked <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} to {shortenAddress(parsed.args[0])}
                </div>
            };
        } else {
            // const value = decimals ? formatUnits(parsed.args[1].toString(), decimals) : parsed.args[1].toString();
            return {
                title: 'Approved',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Approved <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} for {shortenAddress(parsed.args[0])}
                </div>
            };
        }
    },
    // safeTransferFrom (ERC721)
    "0x42842e0e": (arg: TranslationArgs) => {
        // Transfer {amount} of {token image}{contract name}{(token symbol)}
        const { icon = TokenIcon, symbol = TokenSymbol, name = TokenName, data } = arg;
        const parsed = ERC721_INTERFACE.parseTransaction({ data });
        const value = parsed.args[2].toString();
        return {
            title: 'Transfer',
            args: parsed.args,
            content: <div style={{ ...StyleWrap }}>
                Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
            </div>
        };
    },
    // setApprovalForAll (ERC721, ERC1155)
    "0xa22cb465": (arg: TranslationArgs) => {
        const { symbol = TokenSymbol, data } = arg;
        const parsed = ERC721_INTERFACE.parseTransaction({ data });
        if (parsed.args[1] === false) {
            return {
                title: 'Revoked',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Revoked {symbol} from {shortenAddress(parsed.args[0])}
                </div>
            };
        } else {
            return {
                title: 'Approved',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Approved {symbol} for {shortenAddress(parsed.args[0])}
                </div>
            };
        }
    },
    // safeTransferFrom (ERC1155)
    "0xf242432a": (arg: TranslationArgs) => {
        // Transfer {amount} of {token image}{contract name}{(token symbol)}
        const { icon = TokenIcon, symbol = TokenSymbol, name = TokenName, data } = arg;
        const parsed = ERC1155_INTERFACE.parseTransaction({ data });
        const value = parsed.args[3].toString();
        if (parsed.args[1] === Zero) {
            return {
                title: 'Burn',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Burn {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                </div>
            }
        } else {
            return {
                title: 'Transfer',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                </div>
            };
        }
    },
    // safeBatchTransferFrom (ERC1155)
    "0x2eb2c2d6": (arg: TranslationArgs) => {
        // Transfer {amount} of {token image}{contract name}{(token symbol)}
        const { icon = TokenIcon, symbol = TokenSymbol, name = TokenName, data } = arg;
        const parsed = ERC1155_INTERFACE.parseTransaction({ data });
        const value = parsed.args[3].reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0')).toString();
        if (parsed.args[1] === Zero) {
            return {
                title: 'Burn',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Burn {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                </div>
            }
        } else if (parsed.args[2] === Zero) {
            return {
                title: 'Mint',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Mint {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                </div>
            };
        }
        return {
            title: 'Transfer',
            args: parsed.args,
            content: <div style={{ ...StyleWrap }}>
                Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
            </div>
        };
    }
}
const EventTranslate: TranslationEvent = {
    // Approval (ERC20)
    "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": (arg: EventList) => {
        const { icon = TokenIcon, symbol = TokenSymbol, decimals = TokenDecimals, name = TokenName } = arg;
        const methodId = "0x095ea7b3";
        const eTransaction: TranslationArgs = {
            data: methodId + arg.topics[1].substring(2) + arg.data.substring(2), // spender, value
            icon,
            symbol,
            decimals,
            name,
        }
        return MethodDataTranslate[methodId](eTransaction);
    },
    // Transfer (ERC20,ERC721)
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": (arg: EventList) => {
        const { icon = TokenIcon, symbol = TokenSymbol, decimals = TokenDecimals, name = TokenName } = arg;
        const methodId = "0x23b872dd";
        const eTransaction: TranslationArgs = {
            data: "",
            icon,
            symbol,
            decimals,
            name,
        }
        // ERC721
        if (arg.data === '0x') {
            // Mint
            if (arg.topics[1] === "0x0000000000000000000000000000000000000000000000000000000000000000") {
                return {
                    title: 'Mint',
                    args: [arg.topics[2], arg.topics[3]], // to, tokenId
                    content: <div style={{ ...StyleWrap }}>
                        Mint 1 <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                    </div>
                };
            }
            // transferFrom
            else {
                eTransaction.decimals = 0;
                if (arg.topics[2] === "0x0000000000000000000000000000000000000000000000000000000000000000") {
                    eTransaction.data = methodId + arg.topics[1].substring(2) + arg.topics[2].substring(2) + "0000000000000000000000000000000000000000000000000000000000000001"; // from, to, amount (ERC721 can only transfer 1)
                } else {
                    eTransaction.data = methodId + arg.topics[1].substring(2) + arg.topics[2].substring(2) + "0000000000000000000000000000000000000000000000000000000000000001";
                }
            }
        }
        // ERC20
        else {
            eTransaction.data = methodId + arg.topics[1].substring(2) + arg.topics[2].substring(2) + arg.data.substring(2); // from, to, value
        }
        return MethodDataTranslate[methodId](eTransaction);
    },
    // ApprovalForAll (ERC721, 1155)
    "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31": (arg: EventList) => {
        const { icon = TokenIcon, symbol = TokenSymbol } = arg;
        const parsed = ERC1155_INTERFACE.parseLog(arg);
        if (parsed.args[2] === false) {
            return {
                title: 'Revoked',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Revoked <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} to {shortenAddress(parsed.args[0])}
                </div>

            };
        } else {
            return {
                title: 'Approved',
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Approved <img src={icon} alt={symbol} style={StyleIcon} /> {symbol} for {shortenAddress(parsed.args[0])}
                </div>
            };
        }
    },
    // TransferSingle (ERC1155)
    "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62": (arg: EventList) => {
        const { icon = TokenIcon, symbol = TokenSymbol, name = TokenName } = arg;
        const parsed = ERC1155_INTERFACE.parseLog(arg);
        const value = parsed.args[4].reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0')).toString();
        return {
            title: "TransferSingle",
            args: parsed.args,
            content: <div style={{ ...StyleWrap }}>
                TransferSingle {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
            </div>
        };
    },
    // TransferBatch (ERC1155) 
    "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb": (arg: EventList) => {
        const { icon = TokenIcon, symbol = TokenSymbol, name = TokenName } = arg;
        const parsed = ERC1155_INTERFACE.parseLog(arg);
        const value = parsed.args[4].reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0')).toString();
        if (parsed.args[2] === Zero) {
            return {
                title: "Burn",
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Burn {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                </div>
            };
        } else if (parsed.args[1] === Zero) {
            return {
                title: "Mint",
                args: parsed.args,
                content: <div style={{ ...StyleWrap }}>
                    Mint {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
                </div>
            };
        }
        return {
            title: "Transfer",
            args: parsed.args,
            content: <div style={{ ...StyleWrap }}>
                Transfer {value} <img src={icon} alt={symbol} style={StyleIcon} /> {name} {symbol}
            </div>
        };
    }
}

export const DecodeAction = (transaction: TranslationArgs): ReturnDataType | undefined => {
    if (!transaction || !transaction.data || transaction.data.length < 10) return;

    const methodId: string = transaction.data.slice(0, 10);
    const methodAction = MethodDataTranslate[methodId];

    if (!methodAction) return;
    const result = MethodDataTranslate[methodId](transaction);
    const eventResult: ReturnType[] = []
    if (transaction.event) {
        transaction.event.list.forEach((e: EventList) => {
            const evnetHash = e.topics[0];
            if (EventTranslate[evnetHash]) {
                const eResult = EventTranslate[evnetHash](e);
                if (eResult) {
                    eventResult.push(eResult);
                }
            }
        });
    }

    return {
        data: result,
        event: eventResult
    };
}


/* eslint-disable @typescript-eslint/no-explicit-any */
import { Interface } from '@ethersproject/abi';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20_ABI, ERC721_ABI, ERC1155_ABI } from './abi';
import { Translation, TranslationArgs, TranslationEvent, EventList, TokenInfo, CustomInfo, MultiAction, DecodeDataReturnType, TransactionActionProps, AddressNameTagContainerProps } from './type';
export type { Translation, TranslationArgs, TranslationEvent, EventList, TokenInfo, CustomInfo, MultiAction, DecodeDataReturnType, TransactionActionProps, AddressNameTagContainerProps };

// eslint-disable-next-line react-refresh/only-export-components
const Zero = '0x0000000000000000000000000000000000000000';
// eslint-disable-next-line react-refresh/only-export-components
const EventZero =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
// eslint-disable-next-line react-refresh/only-export-components
const EventOne =
    '0x0000000000000000000000000000000000000000000000000000000000000001';


const ERC20_INTERFACE = new Interface(ERC20_ABI);
const ERC721_INTERFACE = new Interface(ERC721_ABI);
const ERC1155_INTERFACE = new Interface(ERC1155_ABI);

// eslint-disable-next-line react-refresh/only-export-components
const ActionTranslate: Translation = {
    // transfer (ERC20)
    '0xa9059cbb': (arg: TranslationArgs) => {
        const { decimals, data, address, to } = arg;
        const parsed = ERC20_INTERFACE.parseTransaction({ data });
        const value = decimals
            ? formatUnits(parsed.args[1].toString(), decimals)
            : parsed.args[1].toString();
        return {
            type: 'ERC20_Transfer',
            title: 'Transfer',
            args: parsed.args,
            address: to || address,
            toAddress: parsed.args[0],
            value,
            customInfo: arg,
        };
    },
    // transferFrom (ERC20,ERC721)
    '0x23b872dd': (arg: TranslationArgs) => {
        const { decimals, data, address, to } = arg;
        const parsed = ERC20_INTERFACE.parseTransaction({ data });
        const value = decimals
            ? formatUnits(parsed.args[2].toString(), decimals)
            : parsed.args[2].toString();
        if (parsed.args[1] === Zero) {
            // only ERC721
            return {
                type: 'ERC721_Burn',
                title: 'Burn',
                args: parsed.args,
                value,
                address: to || address,
                customInfo: arg,
            };
        }
        const tokenInfo =
            arg?.token?.transferType ||
            arg.transferType ||
            filterByTokenAddress(arg.token, arg.to)?.token.transferType;

        if (tokenInfo === 'ERC721') {
            return {
                type: 'ERC721_Transfer',
                title: 'Transfer',
                args: parsed.args,
                value: '1',
                address: to || address,
                toAddress: parsed.args[1],
                customInfo: arg,
            };
        }
        return {
            type: 'ERC20_Transfer',
            title: 'Transfer',
            args: parsed.args,
            address: to || address,
            toAddress: parsed.args[1],
            value,
            customInfo: arg,
        };
    },
    // approve (ERC20)
    '0x095ea7b3': (arg: TranslationArgs) => {
        const { data, address, to } = arg;
        const parsed = ERC20_INTERFACE.parseTransaction({ data });
        if (parsed.args[1].isZero()) {
            return {
                type: 'ERC20_Revoked',
                address: to || address,
                toAddress: parsed.args[0],
                title: 'Revoked',
                args: parsed.args,
                customInfo: arg,
            };
        } else {
            return {
                type: 'ERC20_Approved',
                address: to || address,
                toAddress: parsed.args[0],
                title: 'Approved',
                args: parsed.args,
                customInfo: arg,
            };
        }
    },
    // safeTransferFrom (ERC721)
    '0x42842e0e': (arg: TranslationArgs) => {
        // Transfer {amount} of {token image}{contract name}{(token symbol)}
        const { data, address, to } = arg;
        const parsed = ERC721_INTERFACE.parseTransaction({ data });
        // const id = parsed.args[2].toString();
        return {
            type: 'ERC721_SafeTransferFrom',
            title: 'Transfer',
            args: parsed.args,
            value: '1',
            address: to || address,
            toAddress: parsed.args[1],
            customInfo: arg,
        };
    },
    // safeTransferFrom (ERC721)
    '0xb88d4fde': (arg: TranslationArgs) => {
        // Transfer {amount} of {token image}{contract name}{(token symbol)}
        const { data, address, to } = arg;
        const parsed = ERC721_INTERFACE.parseTransaction({ data });
        // const id = parsed.args[2].toString();
        return {
            type: 'ERC721_SafeTransferFrom',
            title: 'Transfer',
            args: parsed.args,
            value: '1',
            address: to || address,
            toAddress: parsed.args[0],
            customInfo: arg,
        };
    },
    // setApprovalForAll (ERC721, ERC1155)
    '0xa22cb465': (arg: TranslationArgs) => {
        const { data, address, to } = arg;
        const parsed = ERC721_INTERFACE.parseTransaction({ data });
        const tokenInfo =
            arg?.token?.transferType ||
            arg.transferType ||
            filterByTokenAddress(arg.token, arg.to)?.token.transferType;
        if (tokenInfo === 'ERC721') {
            if (parsed.args[1] === false) {
                return {
                    type: 'ERC721_Revoked',
                    title: 'Revoked',
                    args: parsed.args,
                    address: to || address,
                    toAddress: parsed.args[0],
                    customInfo: arg,
                };
            } else {
                return {
                    type: 'ERC721_Approved',
                    title: 'Approved',
                    args: parsed.args,
                    address: to || address,
                    toAddress: parsed.args[0],
                    customInfo: arg,
                };
            }
        }
        if (parsed.args[1] === false) {
            return {
                type: 'ERC1155_Revoked',
                title: 'Revoked',
                args: parsed.args,
                address: to || address,
                toAddress: parsed.args[0],
                customInfo: arg,
            };
        } else {
            return {
                type: 'ERC1155_Approved',
                title: 'Approved',
                args: parsed.args,
                address: to || address,
                toAddress: parsed.args[0],
                customInfo: arg,
            };
        }
    },
    // safeTransferFrom (ERC1155)
    '0xf242432a': (arg: TranslationArgs) => {
        // Transfer {amount} of {token image}{contract name}{(token symbol)}
        const { data, address, to } = arg;
        const parsed = ERC1155_INTERFACE.parseTransaction({ data });
        const value = parsed.args[3].toString();
        if (parsed.args[1] === Zero) {
            return {
                ...arg,
                type: 'ERC1155_Burn',
                title: 'Burn',
                args: parsed.args,
                value,
                address: to || address,
                toAddress: parsed.args[0],
                customInfo: arg,
            };
        } else {
            return {
                ...arg,
                type: 'ERC1155_SafeTransferFrom',
                title: 'Transfer',
                args: parsed.args,
                value,
                address: to || address,
                toAddress: parsed.args[0],
                customInfo: arg,
            };
        }
    },
    // safeBatchTransferFrom (ERC1155)
    '0x2eb2c2d6': (arg: TranslationArgs) => {
        // Transfer {amount} of {token image}{contract name}{(token symbol)}
        const { data, address, to } = arg;
        const parsed = ERC1155_INTERFACE.parseTransaction({ data });
        const value = parsed.args[3]
            .reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0'))
            .toString();
        if (parsed.args[1] === Zero) {
            return {
                type: 'ERC1155_BatchBurn',
                title: 'Burn',
                args: parsed.args,
                value,
                address: to || address,
                customInfo: arg,
            };
        } else if (parsed.args[2] === Zero) {
            return {
                type: 'ERC1155_BatchMint',
                title: 'Mint',
                args: parsed.args,
                address: to || address,
                toAddress: parsed.args[0],
                value,
                customInfo: arg,
            };
        }
        return {
            type: 'ERC1155_SafeBatchTransferFrom',
            title: 'Transfer',
            args: parsed.args,
            value,
            address: to || address,
            customInfo: arg,
        };
    },
};

// eslint-disable-next-line react-refresh/only-export-components
const EventTranslate: TranslationEvent = {
    // Approval (ERC20,ERC721)
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925': (
        arg: EventList,
    ) => {
        const { icon, symbol, decimals, name } = arg;
        let methodId = '0x095ea7b3';
        if (arg.topics.length > 3) {
            methodId = '0xa22cb465';
            if (arg.token) {
                arg.token.transferType = 'ERC721';
            }
            arg.transferType = 'ERC721';
            const parsed = ERC721_INTERFACE.parseLog(arg);

            // parsed.args[2] instanceof BigNumber is for ERC721 Approve, else is for ERC721 Revoked
            const value =
                parsed.args[2] instanceof BigNumber
                    ? EventOne.substring(2)
                    : EventZero.substring(2);
            const eTransaction: TranslationArgs = {
                ...arg,
                data: methodId + arg.topics[2].substring(2) + value, // spender, value
                icon,
                symbol,
                decimals,
                name,
            };
            return ActionTranslate[methodId](eTransaction);
        }

        const eTransaction: TranslationArgs = {
            ...arg,
            data: methodId + arg.topics[2].substring(2) + arg.data.substring(2), // spender, value
            icon,
            symbol,
            decimals,
            name,
        };
        return ActionTranslate[methodId](eTransaction);
    },
    // Transfer (ERC20,ERC721)
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': (
        arg: EventList,
    ) => {
        const methodId = '0x23b872dd';
        const eTransaction: TranslationArgs = {
            ...arg,
        };
        // ERC721
        if (arg.data === '0x') {
            // Mint
            if (arg.topics[1] === EventZero) {
                return {
                    type: 'ERC721_Mint',
                    title: 'Mint',
                    args: [arg.topics[2], arg.topics[3]], // to, tokenId
                    address: arg.address, //`0x${Buffer.from(stripZeros(arg.topics[2])).toString('hex',)}`,
                    value: '1',
                    customInfo: arg,
                };
            }
            // Burn
            if (arg.topics[2] === EventZero) {
                return {
                    type: 'ERC721_Burn',
                    title: 'Mint',
                    args: [arg.topics[2], arg.topics[3]], // to, tokenId
                    address: arg.address, //`0x${Buffer.from(stripZeros(arg.topics[2])).toString('hex',)}`,
                    value: '1',
                    customInfo: arg,
                };
            }
            // transferFrom
            else {
                eTransaction.decimals = 0;
                if (arg.topics[2] === EventZero) {
                    eTransaction.data =
                        methodId +
                        arg.topics[1].substring(2) +
                        arg.topics[2].substring(2) +
                        '0000000000000000000000000000000000000000000000000000000000000001'; // from, to, amount (ERC721 can only transfer 1)
                } else {
                    eTransaction.data =
                        methodId +
                        arg.topics[1].substring(2) +
                        arg.topics[2].substring(2) +
                        '0000000000000000000000000000000000000000000000000000000000000001';
                    if (eTransaction.token) {
                        eTransaction.token.transferType = 'ERC721';
                    }
                    eTransaction.transferType = 'ERC721';
                }
            }
        }

        // ERC20
        else {
            if (arg.topics.length === 2) {
                eTransaction.data =
                    '0xa9059cbb' + arg.topics[1].substring(2) + arg.data.substring(2); // to, value
                return ActionTranslate['0xa9059cbb'](eTransaction);
            } else {
                eTransaction.data =
                    methodId +
                    arg.topics[1].substring(2) +
                    arg.topics[2].substring(2) +
                    arg.data.substring(2); // from, to, value
                return ActionTranslate[methodId](eTransaction);
            }
        }

        return ActionTranslate[methodId](eTransaction);
    },
    // ApprovalForAll (ERC721, 1155)
    '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31': (
        arg: EventList,
    ) => {
        const parsed = ERC1155_INTERFACE.parseLog(arg);
        const tokenInfo =
            arg?.token?.transferType ||
            arg.transferType ||
            filterByTokenAddress(arg.token, arg.to || arg.address)?.token
                .transferType;
        if (tokenInfo === 'ERC721') {
            if (parsed.args[2] === false) {
                return {
                    ...arg,
                    type: 'ERC721_Revoked',
                    title: 'Revoked',
                    args: parsed.args,
                    address: arg.address,
                    toAddress: parsed.args[1],
                    customInfo: arg,
                };
            } else {
                return {
                    ...arg,
                    type: 'ERC721_Approved',
                    title: 'Approved',
                    args: parsed.args,
                    address: arg.address,
                    toAddress: parsed.args[1],
                    customInfo: arg,
                };
            }
        }
        if (parsed.args[2] === false) {
            return {
                ...arg,
                type: 'ERC1155_Revoked',
                title: 'Revoked',
                args: parsed.args,
                address: arg.address,
                toAddress: parsed.args[1],
                customInfo: arg,
            };
        } else {
            return {
                ...arg,
                type: 'ERC1155_Approved',
                title: 'Approved',
                args: parsed.args,
                address: arg.address,
                toAddress: parsed.args[1],
                customInfo: arg,
            };
        }
    },
    // TransferSingle (ERC1155)
    '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62': (
        arg: EventList,
    ) => {
        const parsed = ERC1155_INTERFACE.parseLog(arg);
        let value;
        if (Array.isArray(parsed.args[4])) {
            value = parsed.args[4]
                .reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0'))
                .toString();
        } else {
            value = parsed.args[4].toString();
        }

        if (parsed.args[1] === Zero && parsed.args[2] !== Zero) {
            return {
                type: 'ERC1155_Mint',
                address: arg.address,
                toAddress: parsed.args[0],
                title: 'Mint',
                args: parsed.args,
                value,
                customInfo: arg,
            };
        }
        if (parsed.args[2] === Zero && parsed.args[1] !== Zero) {
            return {
                type: 'ERC1155_Burn',
                address: arg.address,
                toAddress: parsed.args[0],
                title: 'Mint',
                args: parsed.args,
                value,
                customInfo: arg,
            };
        }

        return {
            type: 'ERC1155_Transfer',
            title: 'TransferSingle',
            args: parsed.args,
            address: arg.address,
            toAddress: parsed.args[0],
            value,
            customInfo: arg,
        };
    },
    // TransferBatch (ERC1155)
    '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb': (
        arg: EventList,
    ) => {
        const parsed = ERC1155_INTERFACE.parseLog(arg);
        const value = parsed.args[4]
            .reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from('0'))
            .toString();
        if (parsed.args[2] === Zero) {
            return {
                type: 'ERC1155_BatchBurn',
                title: 'Burn',
                args: parsed.args,
                address: arg.address,
                toAddress: parsed.args[0],
                value,
                customInfo: arg,
            };
        } else if (parsed.args[1] === Zero) {
            return {
                type: 'ERC1155_BatchMint',
                title: 'Mint',
                args: parsed.args,
                address: arg.address,
                toAddress: parsed.args[0],
                value,
                customInfo: arg,
            };
        }
        return {
            type: 'ERC1155_SafeBatchTransferFrom',
            title: 'Transfer',
            args: parsed.args,
            address: arg.address,
            toAddress: parsed.args[0],
            value,
            customInfo: arg,
        };
    },
};

function isObjectAndNotEmpty(obj: any) {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        !Array.isArray(obj) &&
        Object.keys(obj).length > 0
    );
}


export const filterByTokenAddress = (
    data: TokenInfo[] | TokenInfo,
    address: string | undefined,
): TokenInfo | undefined => {
    if (Array.isArray(data)) {
        const found = data.find(item => item.token?.address === address);
        return found ?? undefined;
    } else if (typeof data === 'object' && data !== null) {
        if (data.token?.address === address) {
            return data;
        }
    }
    return undefined;
};

export const decodeData = (
    transaction: TranslationArgs,
    event?: EventList[],
    customInfo?: CustomInfo,
    customUI?: MultiAction,
): DecodeDataReturnType => {
    try {
        if (!isObjectAndNotEmpty(transaction))
            return {
                args: undefined,
                content: undefined,
            };
        let result;
        let dataContent: any = [];

        const methodId: string = transaction?.data?.slice(0, 10) ?? '';

        if (ActionTranslate[methodId]) {
            result = ActionTranslate[methodId]({
                token: customInfo,
                ...transaction,
            });

            const actionType: string = result.type;

            if (actionType && customUI && customUI[actionType]) {
                const customResult = customUI[actionType](result);
                dataContent.push(customResult);
            }
        }

        // If the method is not in the whitelist, the event will not be translated.
        if (dataContent && dataContent.length > 0 && event && event.length > 0) {
            const eventContent: any = [];

            event.forEach((e: EventList) => {
                const eventHash = Array.isArray(e.topics) && e.topics.length > 0 ? e.topics[0] : null;
                if (customUI && eventHash && EventTranslate[eventHash]) {
                    const eResult = EventTranslate[eventHash]({
                        token: customInfo,
                        ...e,
                    });
                    // Special processing for ERC721.safeTransferFrom, event is not translated approve
                    if (
                        [
                            '0x23b872dd',
                            '0x42842e0e',
                            '0xb88d4fde',
                            '0xf242432a',
                            '0x2eb2c2d6',
                        ].includes(methodId) &&
                        (eResult.type === 'ERC721_Revoked' ||
                            eResult.type === 'ERC721_Approved')
                    ) {
                        return;
                    }

                    const actionType: string = eResult.type;
                    if (customUI[actionType]) {
                        eventContent.push(customUI[actionType](eResult));
                    }
                }
            });

            // If event has a value, use event first.
            if (eventContent.length > 0) {
                dataContent = eventContent;
            }
        }

        // Add a separate whitelist for events.
        if (
            dataContent &&
            dataContent.length === 0 &&
            event &&
            event.length > 0 &&
            customUI
        ) {
            const eventContent: any = [];
            const eResultArr: any = [];
            event.forEach((e: EventList) => {
                // ERC721,1155 Transfer, mint,burn
                const EventWihtelist = [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
                    '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
                ];

                if (Array.isArray(e.topics) && e.topics.length > 0 && EventWihtelist.includes(e.topics[0])) {
                    // 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef maybe ERC20, filter out these transactions.
                    if (
                        [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        ].includes(e.topics[0]) &&
                        e.data !== '0x'
                    ) {
                        return;
                    }
                    // Contains only mint, burn.
                    if (!(e.topics[1] === EventZero || e.topics[2] === EventZero)) {
                        return;
                    }
                    const eventHash = e.topics[0];
                    if (EventTranslate[eventHash]) {
                        const eResult = EventTranslate[eventHash]({
                            token: customInfo,
                            ...e,
                        });

                        const actionType: string = eResult.type;
                        if (customUI[actionType]) {
                            eResultArr.push(eResult);
                        }
                    }
                }
            });

            const uniqueArray = eResultArr.reduce(
                (acc: EventList, current: EventList) => {
                    const found = acc.find(
                        (item: EventList) =>
                            item['address'] === current['address'] &&
                            [
                                'ERC721_Mint',
                                'ERC721_Burn',
                                'ERC721_Transfer',
                                'ERC1155_Mint',
                                'ERC1155_Burn',
                                'ERC1155_Transfer',
                            ].includes(item['type']),
                    );
                    if (found) {
                        found.value = Number(found.value) + Number(current.value);
                    } else {
                        acc.push(current);
                    }
                    return acc;
                },
                [],
            );

            uniqueArray.forEach((item: any) => {
                eventContent.push(customUI[item.type](item));
            });
            // If event has a value, use event first.
            if (eventContent.length > 0) {
                dataContent = eventContent;
            }
        }

        return {
            args: result && result.args,
            content: dataContent,
        };
    } catch (error) {
        // console.log(error);
        return {
            args: undefined,
            content: undefined,
        };
    }
};

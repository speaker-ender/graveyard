import { Networkish, Web3Provider } from "@ethersproject/providers";
import { getPriorityConnector, getSelectedConnector } from "@web3-react/core";
import { ConnectorName, Connectors, getConnectorName } from "connectors/connectors";
import { createContext, useCallback, useContext } from "react";
import { useState } from "react";

export const PriorityConnector = getPriorityConnector(...Connectors);

export type Web3ReactActiveHooks = ReturnType<typeof useActiveConnectorHooks>

export type IActiveConnectorState = ReturnType<typeof useActiveConnectorHooks> | null;
export const ActiveConnectorContext = createContext<IActiveConnectorState>(
    null
);

export const useActiveConnectorHooks = () => {
    const {
        useSelectedChainId,
        useSelectedAccounts,
        useSelectedIsActivating,
        useSelectedError,
        useSelectedAccount,
        useSelectedIsActive,
        useSelectedProvider,
        useSelectedENSNames,
        useSelectedENSName,
        useSelectedWeb3React,
    } = getSelectedConnector(...Connectors)

    const [activeConnectorName, setActiveConnectorName] = useState<ConnectorName>(null!);
    const [selectedConnectorChainId, setSelectedConnectorChainId] = useState<number>(-1);

    const { usePriorityConnector } = getPriorityConnector(...Connectors);

    const useActiveConnector = useCallback(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = Connectors.map(([connector, { useIsActive }]) => useIsActive() && activeConnectorName === getConnectorName(connector));
        const priorityConnector = usePriorityConnector();
        const index = values.findIndex((isActive) => isActive)

        if (index === -1) {
            return priorityConnector;
        }

        return Connectors[index][0]
    }, [activeConnectorName, setActiveConnectorName]);

    const updateActiveConnectorName = useCallback((connectorName: ConnectorName) => {
        setActiveConnectorName(connectorName);
    }, [activeConnectorName, setActiveConnectorName]);

    const updateSelectedChainId = useCallback((chainId: number) => {
        setSelectedConnectorChainId(chainId);
    }, [selectedConnectorChainId, setSelectedConnectorChainId]);

    const useActiveChainId = () => useSelectedChainId(useActiveConnector());

    const useActiveAccounts = () => useSelectedAccounts(useActiveConnector());

    const useActiveIsActivating = () => useSelectedIsActivating(useActiveConnector());

    function useActiveError() {
        return useSelectedError(useActiveConnector())
    }

    function useActiveAccount() {
        return useSelectedAccount(useActiveConnector())
    }

    function useActiveIsActive() {
        return useSelectedIsActive(useActiveConnector())
    }

    function useActiveProvider(network?: Networkish) {
        return useSelectedProvider(useActiveConnector(), network)
    }

    function useActiveENSNames(provider: Web3Provider | undefined) {
        return useSelectedENSNames(useActiveConnector(), provider)
    }

    function useActiveENSName(provider: Web3Provider | undefined) {
        return useSelectedENSName(useActiveConnector(), provider)
    }

    function useActiveWeb3React(provider: Web3Provider | undefined) {
        return useSelectedWeb3React(useActiveConnector(), provider)
    }

    return {
        useSelectedChainId,
        useSelectedAccounts,
        useSelectedIsActivating,
        useSelectedError,
        useSelectedAccount,
        useSelectedIsActive,
        useSelectedProvider,
        useSelectedENSNames,
        useSelectedENSName,
        useSelectedWeb3React,
        useActiveConnector,
        useActiveChainId,
        useActiveAccounts,
        useActiveIsActivating,
        useActiveError,
        useActiveAccount,
        useActiveIsActive,
        useActiveProvider,
        useActiveENSNames,
        useActiveENSName,
        useActiveWeb3React,
        updateActiveConnectorName,
        activeConnectorName,
        updateSelectedChainId,
        selectedConnectorChainId
    }
};

export const useActiveConnectorContext = () => {
    const enteredContext = useContext(ActiveConnectorContext);

    if (!enteredContext) {
        throw new Error(
            'HeaderMeta Context used outside of HeaderMetaContext.Provider'
        );
    }

    return enteredContext;
};

export const ActiveConnectorContextProvider: React.FC = ({ children }) => {
    const activeConnectorState = useActiveConnectorHooks();

    return (
        <ActiveConnectorContext.Provider value={activeConnectorState}>
            {children}
        </ActiveConnectorContext.Provider>
    );
};

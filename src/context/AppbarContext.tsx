import React, {createContext, useContext, useState, ReactNode, useCallback} from 'react';

type AppbarContextType = {
    appbarContent: ReactNode;
    setAppbarContent: (content: ReactNode) => void;
    appbarTitle: string;
    setAppbarTitle: (title: string) => void;
    centerTitle: boolean;
    setCenterTitle: (center: boolean) => void;
    overlapContent: boolean;
    setOverlapContent: (value: boolean) => void;
    appbarActions: ReactNode[];
    setAppbarActions: (actions: ReactNode[]) => void;
    showAppbar: boolean;
    setShowAppbar: (show: boolean) => void;
};

const AppbarContext = createContext<AppbarContextType | undefined>(undefined);

export const AppbarProvider = ({children}: {children: ReactNode}) => {
    const [appbarContent, setAppbarContent] = useState<ReactNode>(null);
    const [overlapContent, setOverlapContent] = useState(false); // Default to false

    const [appbarTitle, setAppbarTitle] = useState<string>('');
    const [centerTitle, setCenterTitle] = useState<boolean>(false);

    const [appbarActions, setAppbarActions] = useState<ReactNode[]>([]);
    const [showAppbar, setShowAppbar] = useState(false);

    return (
        <AppbarContext.Provider
            value={{
                appbarContent,
                setAppbarContent,
                appbarTitle,
                setAppbarTitle,
                centerTitle,
                setCenterTitle,
                overlapContent,
                setOverlapContent,
                appbarActions,
                setAppbarActions,
                showAppbar,
                setShowAppbar,
            }}>
            {children}
        </AppbarContext.Provider>
    );
};

export const useAppbar = () => {
    const context = useContext(AppbarContext);
    if (!context) {
        throw new Error('You need to use this inside an AppbarProvider otherwise... kaboom!');
    }

    const {
        setAppbarTitle,
        setAppbarActions,
        setCenterTitle,
        setOverlapContent,
        setShowAppbar,
    } = context;

    const expandAppbar = useCallback(
        ({
             title = '',
             actions = [],
             centerTitle = false,
             overlapContent = false,
        }: {
            title?: string;
            actions?: React.ReactNode[];
            centerTitle?: boolean;
            overlapContent?: boolean;
        }) => {
            setAppbarTitle(title);
            setAppbarActions(actions);
            setCenterTitle(centerTitle);
            setOverlapContent(overlapContent);
            setShowAppbar(true);
        },
        [setAppbarTitle, setAppbarActions, setCenterTitle, setOverlapContent, setShowAppbar]
    );

    const collapseAppbar = useCallback(() => {
        setShowAppbar(false);
        setAppbarTitle('');
        setAppbarActions([]);
        setCenterTitle(false);
        setOverlapContent(true);
    }, [setShowAppbar, setAppbarTitle, setAppbarActions, setCenterTitle, setOverlapContent]);

    return {
        ...context,
        expandAppbar,
        collapseAppbar,
    };
};

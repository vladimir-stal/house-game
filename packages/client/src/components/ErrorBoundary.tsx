import { Component, ErrorInfo, ReactNode } from 'react';

interface IProps {
    fallback: ReactNode;
    children?: ReactNode;
}

interface IState {
    hasError: boolean;
}

class ErrorBoundary extends Component<IProps, IState> {
    public state: IState = {
        hasError: false,
    };

    constructor(props: IProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: unknown) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: unknown, info: ErrorInfo) {
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        console.log('ERROR!', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

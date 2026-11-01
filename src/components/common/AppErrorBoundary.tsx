import { Component, type ReactNode } from "react";
import { ErrorState } from "./ErrorState";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="This part of the garden could not open."
          description="Something interrupted this page. Reload it to try again, or return to the home page."
          action={
            <div className="button-row">
              <button className="button button--primary" type="button" onClick={() => window.location.reload()}>
                Reload page
              </button>
              <a className="button button--secondary" href="/">
                Return home
              </a>
            </div>
          }
        />
      );
    }

    return this.props.children;
  }
}

import { Component, type ReactNode } from "react";
import { ErrorNotice } from "./molecules/ErrorNotice";

export type OrganismErrorBoundaryProps = {
  label: string;
  children: ReactNode;
};

type OrganismErrorBoundaryState = {
  hasError: boolean;
};

export class OrganismErrorBoundary extends Component<OrganismErrorBoundaryProps, OrganismErrorBoundaryState> {
  state: OrganismErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): OrganismErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorNotice message={`${this.props.label} couldn't be shown.`} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

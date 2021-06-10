import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ResultActions } from '../../actions/results';
import SplitPane from 'react-split-pane';
import Header from '../../components/Header';
import Commit from '../../components/LogView/Commit';
import LogView from '../../components/LogView/LogView';
import { ISettings, LogEntry } from '../../definitions';
import { LogEntriesState, RootState } from '../../reducers';
import { IConfiguration } from '../../reducers/vscode';
import Footer from '../../components/Footer';
import { ContextMenu } from './ContextMenu';

type AppProps = {
    configuration: IConfiguration;
    settings: ISettings;
    logEntries: LogEntriesState;
    getCommits: typeof ResultActions.getCommits;
    getPreviousCommits: typeof ResultActions.getPreviousCommits;
    getNextCommits: typeof ResultActions.getNextCommits;
    search: typeof ResultActions.search;
} & typeof ResultActions;

interface AppState {
    percent: string;
    logEntry?: LogEntry;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props?: AppProps, context?: any) {
        super(props, context);
        this.state = { percent: "100%" }
    }

    componentDidMount() {
        document.addEventListener("contextmenu", ContextMenu.create)
        document.addEventListener("click", event => {
            ContextMenu.click(event, (action)=>{
                this.onMenuClick(action)
            })
        })
    }

    private onMenuClick(action: string) {
        switch (action) {
            case "copyHash":
                console.log(this.state.logEntry?.hash)
                break;
            case "addTag":
                break;
        }
    }

    private goBack = async () => {
        await this.props.getPreviousCommits();
        document.getElementById('scrollCnt').scrollTo(0, 0);
    };
    private goForward = async () => {
        await this.props.getNextCommits();
        document.getElementById('scrollCnt').scrollTo(0, 0);
    };

    public render() {
        const { children } = this.props;
        const canGoForward =
            this.props.logEntries.count === -1 ||
            (this.props.logEntries.pageIndex + 1) * this.props.configuration.pageSize < this.props.logEntries.count;
        return (
            <div className="appRootParent">
                <div className="appRoot">
                    <Header></Header>
                    <SplitPane
                        split={this.props.configuration.sideBySide ? 'vertical' : 'horizontal'}
                        pane1Style={{ overflowY: 'auto' }}
                        defaultSize={this.state.percent}
                        style={{ paddingTop: '40px' }}
                        primary="first"
                    >
                        <LogView logEntries={this.props.logEntries} configuration={this.props.configuration} onCommitClick={this.onCommitClick}></LogView>
                        {this.props.logEntries && this.props.logEntries.selected ?
                            <Commit onCloseCommitView={this.hiddenCommit} /> :
                            <div className="detail-view-info">
                                <div>Pick a commit from the list to view details</div>
                            </div>
                        }
                    </SplitPane>
                    <Footer
                        canGoBack={this.props.logEntries.pageIndex > 0}
                        canGoForward={canGoForward}
                        goBack={this.goBack}
                        goForward={this.goForward}
                    ></Footer>
                </div>
                {children}
            </div>
        );
    }

    public onCommitClick = (logEntry: LogEntry) => {
        let percent = '100%'
        if (this.state.percent == '100%') {
            percent = globalThis.fileName ? "70%" : "50%";
        }
        this.setState({ percent, logEntry })
    };

    public hiddenCommit = () => {
        this.setState({ percent: '100%' })
    }

}

function mapStateToProps(state: RootState) {
    return {
        configuration: state.vscode.configuration,
        settings: state.settings,
        logEntries: state.logEntries,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({ ...ResultActions }, dispatch),
        getCommits: () => dispatch(ResultActions.getCommits()),
        getNextCommits: () => dispatch(ResultActions.getNextCommits()),
        getPreviousCommits: () => dispatch(ResultActions.getPreviousCommits()),
        search: (text: string) => dispatch(ResultActions.search(text)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

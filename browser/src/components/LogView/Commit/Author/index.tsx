import * as React from 'react';
import { connect } from 'react-redux';
import { ActionedDetails } from '../../../../definitions';
import { RootState } from '../../../../reducers/index';
import { ResultActions } from '../../../../actions/results';
var format = require('date-format');

type AuthorProps = {
    result: ActionedDetails;
    locale: string;
    hash?: string;
    selectAuthor(author: string): void;
};

export function Author(props: AuthorProps) {
    function selectAuthor(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault();
        event.stopPropagation();
        props.selectAuthor(props.result.name);
    }
    const hash = props
    return (
        <div className="commit-author">
            {props.hash != null &&
                <span style={{ marginRight: '5px' }}>
                    {props.hash}
                </span>
            }
            <span className="name hint--right hint--rounded hint--bounce" aria-label={props.result.email}  style={{ marginRight: '5px' }}>
                {props.result.name}
            </span>
            <span className="timestamp"> {formatDateTime(props.locale, props.result.date)}</span>
        </div>
    );
}

function formatDateTime(locale: string, date?: Date) {
    if (date && typeof date.toLocaleDateString !== 'function') {
        return '';
    }
    return format.asString("yyyy-MM-dd hh:mm", date);
}

function mapStateToProps(state: RootState, wrapper: { result: ActionedDetails }) {
    return {
        result: wrapper.result,
        locale: state.vscode.locale,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectAuthor: (text: string) => dispatch(ResultActions.selectAuthor(text)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Author);

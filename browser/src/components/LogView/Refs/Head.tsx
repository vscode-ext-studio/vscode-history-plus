import { Ref } from '../../../definitions';
import * as React from 'react';
import { GoGitBranch, GoX } from 'react-icons/go';

export default function HeadRef(props: Ref) {
    return (
        <div className="commit-head-container">
            <div className="refs">
                <span onClick={() => props.onAction('checkoutBranch')}>
                    <GoGitBranch></GoGitBranch>
                </span>
                <span title={props.name} onClick={() => props.onAction('checkoutBranch')}>{props.name}</span>
                <a className="remove" onClick={() => props.onRemove()} role="button">
                    <GoX></GoX>
                </a>
            </div>
        </div>
    );
}

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Role } from 'app/utils/Community';
import SettingsEditButton from 'app/components/elements/SettingsEditButton';
import SubscribeButton from 'app/components/elements/SubscribeButton';

class CommunityPane extends Component {
    static propTypes = {
        community: PropTypes.object.isRequired,
    };

    render() {
        const { community } = this.props;

        function teamMembers(members) {
            return members.map((row, idx) => {
                const account = `@${row.get(0)}`;
                const title = row.get(2);
                const sep = title ? '/ ' : '';
                const role = row.get(1) != 'mod' ? row.get(1) : null;

                return (
                    <div key={idx} style={{ fontSize: '80%' }}>
                        <Link to={`/${account}`}>{account}</Link>
                        {role && <span className="user_role"> {role} </span>}
                        {title && <span className="affiliation">{title}</span>}
                    </div>
                );
            });
        }

        const category = community.get('name');
        const viewer_role = community.getIn(['context', 'role'], 'guest');

        return (
            <div>
                <div className="c-sidebar__module">
                    {Role.atLeast(viewer_role, 'admin') && (
                        <div style={{ float: 'right', fontSize: '0.8em' }}>
                            <SettingsEditButton
                                community={community.get('name')}
                            >
                                Edit
                            </SettingsEditButton>
                        </div>
                    )}
                    <div className="c-sidebar__header">
                        <h3 className="c-sidebar__h3">
                            {community.get('title')}
                        </h3>
                        {community.get('is_nsfw') && (
                            <span className="affiliation">nsfw</span>
                        )}
                    </div>
                    <div style={{ margin: '-6px 0 12px' }}>
                        {community.get('about')}
                    </div>
                    <div
                        className="row"
                        style={{ textAlign: 'center', lineHeight: '1em' }}
                    >
                        <div className="column small-4">
                            {community.get('subscribers')}
                            <br />
                            <small>
                                {community.get('subscribers') == 1
                                    ? 'subscriber'
                                    : 'subscribers'}
                            </small>
                        </div>
                        <div className="column small-4">
                            {'$'}
                            {community.get('sum_pending')}
                            <br />
                            <small>pending rewards</small>
                        </div>
                        <div className="column small-4">
                            {community.get('num_pending')}
                            <br />
                            <small>pending posts</small>
                        </div>
                    </div>

                    <div style={{ margin: '12px 0 0' }}>
                        <Link
                            className="button primary"
                            style={{
                                minWidth: '6em',
                                display: 'block',
                                marginBottom: '8px',
                            }}
                            to={`/submit.html?category=${category}`}
                        >
                            New Post
                        </Link>
                        {community &&
                            this.props.username && (
                                <SubscribeButton
                                    community={community.get('name')}
                                    display="block"
                                />
                            )}
                    </div>
                    <div>
                        {Role.atLeast(viewer_role, 'mod') && (
                            <div style={{ float: 'right', fontSize: '0.8em' }}>
                                <Link to={`/roles/${category}`}>
                                    Edit Roles
                                </Link>
                            </div>
                        )}
                        <strong>Leadership</strong>
                        {teamMembers(community.get('team', List()))}
                    </div>
                </div>
                <div className="c-sidebar__module">
                    {community.get('description') && (
                        <div>
                            <strong>Description</strong>
                            <br />
                            {community.get('description', 'empty')}
                            <br />
                        </div>
                    )}
                    <div>
                        <strong>Language</strong>
                        <br />
                        {community.get('lang')}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => ({
        community: ownProps.community,
    })
)(CommunityPane);

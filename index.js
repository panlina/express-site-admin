import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

window.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(<Index />, document.body);
});

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			endpoint: "",
			proxyRule: undefined,
			proxyRuleLoading: false,
			newProxyRule: { name: '', value: '' },
			proxyRuleAdding: false,
			proxyRuleAdded: undefined
		};
	}
	connect() {
		this.setState({ proxyRuleLoading: true });
		axios.get(`${this.state.endpoint}/proxy-rule`).then(response => {
			this.setState({ proxyRule: response.data });
			this.setState({ proxyRuleLoading: false });
		}, error => {
			this.setState({ proxyRule: error });
			this.setState({ proxyRuleLoading: false });
		});
	}
	addProxyRule() {
		this.setState({ proxyRuleAdding: true });
		var { name, value } = this.state.newProxyRule;
		axios.put(`${this.state.endpoint}/proxy-rule/${encodeURIComponent(name || 'default')}`, JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } }).then(response => {
			this.setState({ proxyRuleAdded: response.data });
			this.setState({ proxyRuleAdding: false });
			this.state.proxyRule[name] = value;
			this.state.newProxyRule.name = '';
			this.state.newProxyRule.value = '';
			this.setState(this.state);
		}, error => {
			this.setState({ proxyRuleAdded: error });
			this.setState({ proxyRuleAdding: false });
		});
	}
	render() {
		var { proxyRule, proxyRuleLoading, newProxyRule, proxyRuleAdding, proxyRuleAdded } = this.state;
		return <>
			<form onSubmit={e => { this.connect(); e.preventDefault(); }}>
				target: <input value={this.state.endpoint} onChange={e => { this.setState({ endpoint: e.target.value }); }}></input>
				<button>connect</button>
			</form>
			<section>
				<h4>proxy rules</h4>
				<p>{proxyRuleLoading && "loading..."}</p>
				{proxyRule && (
					proxyRule instanceof Error ?
						`error: ${proxyRule.response && proxyRule.response.data || proxyRule.message}` :
						<>
							<table>
								{
									Object.entries(proxyRule).length ?
										Object.entries(proxyRule)
											.map(([name, value]) => <tr key={name}>
												<td>{name || "(default)"}</td>
												<td>{value}</td>
											</tr>) :
										[<tr><td colSpan={2}>(no proxy rules)</td></tr>]
								}
								<tr>
									<td><input form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.name} onChange={e => { this.state.newProxyRule.name = e.target.value; this.setState(this.state); }} /></td>
									<td><input form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.value} onChange={e => { this.state.newProxyRule.value = e.target.value; this.setState(this.state); }} /></td>
									<td>
										{!proxyRuleAdding && <button form="add-proxy-rule" title="add">➕</button>}
										{proxyRuleAdding && "(adding..)"}
										{proxyRuleAdded instanceof Error && `error: ${proxyRuleAdded.response && proxyRuleAdded.response.data || proxyRuleAdded.message}`}
									</td>
								</tr>
							</table>
							<form id="add-proxy-rule" onSubmit={e => { this.addProxyRule(); e.preventDefault(); }}></form>
						</>
				)}
			</section>
		</>;
	}
}

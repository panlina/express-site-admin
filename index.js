import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from "mobx-react";
import axios from 'axios';

window.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(<Index />, document.body);
});

@observer
class Index extends React.Component {
	@observable proxyRuleLoading = false;
	@observable proxyRule = undefined;
	@observable endpoint = "";
	@observable newProxyRule = { name: '', value: '' };
	@observable proxyRuleAdding = false;
	@observable proxyRuleAdded = undefined;
	async connect() {
		try {
			this.proxyRuleLoading = true;
			var response = await axios.get(`${this.endpoint}/proxy-rule`);
			this.proxyRule = response.data;
			this.proxyRuleLoading = false;
		} catch (error) {
			this.proxyRule = error;
			this.proxyRuleLoading = false;
		};
	}
	async addProxyRule() {
		try {
			this.proxyRuleAdding = true;
			var { name, value } = this.newProxyRule;
			var response = await axios.put(`${this.endpoint}/proxy-rule/${encodeURIComponent(name || 'default')}`, JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
			this.proxyRuleAdded = response.data;
			this.proxyRuleAdding = false;
			this.proxyRule[name] = value;
			this.newProxyRule.name = '';
			this.newProxyRule.value = '';
		} catch (error) {
			this.proxyRuleAdded = error;
			this.proxyRuleAdding = false;
		};
	}
	render() {
		var proxyRule = this.proxyRule,
			proxyRuleLoading = this.proxyRuleLoading,
			newProxyRule = this.newProxyRule,
			proxyRuleAdding = this.proxyRuleAdding,
			proxyRuleAdded = this.proxyRuleAdded;
		return <>
			<form onSubmit={e => { this.connect(); e.preventDefault(); }}>
				target: <input value={this.endpoint} onChange={e => { this.endpoint = e.target.value; }}></input>
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
									<td><input form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.name} onChange={e => { this.newProxyRule.name = e.target.value; }} /></td>
									<td><input form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.value} onChange={e => { this.newProxyRule.value = e.target.value; }} /></td>
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

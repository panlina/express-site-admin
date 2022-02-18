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
	@observable endpoint = "";
	@observable proxyRuleLoading = false;
	@observable proxyRule = undefined;
	@observable newProxyRule = { name: '', value: '' };
	@observable proxyRuleAdding = false;
	@observable proxyRuleAdded = undefined;
	@observable proxyRuleDeleting = {};
	@observable proxyRuleDeleted = {};
	@observable proxyRuleEditing = {};
	@observable updatedProxyRule = {};
	@observable proxyRuleUpdating = {};
	@observable proxyRuleUpdated = {};
	@observable proxyRuleNameEditing = {};
	@observable updatedProxyRuleName = {};
	@observable proxyRuleRenaming = {};
	@observable proxyRuleRenamed = {};
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
	async deleteProxyRule(name) {
		try {
			this.proxyRuleDeleting[name] = true;
			var response = await axios.delete(`${this.endpoint}/proxy-rule/${encodeURIComponent(name || 'default')}`);
			this.proxyRuleDeleted[name] = response.data;
			this.proxyRuleDeleting[name] = false;
			delete this.proxyRule[name];
		} catch (error) {
			this.proxyRuleDeleted[name] = error;
			this.proxyRuleDeleting[name] = false;
		};
	}
	async updateProxyRule(name) {
		try {
			this.proxyRuleUpdating[name] = true;
			var response = await axios.put(`${this.endpoint}/proxy-rule/${encodeURIComponent(name || 'default')}`, JSON.stringify(this.updatedProxyRule[name]), { headers: { 'Content-Type': 'application/json' } });
			this.proxyRuleUpdated[name] = response.data;
			this.proxyRuleUpdating[name] = false;
			this.proxyRule[name] = this.updatedProxyRule[name];
			this.proxyRuleEditing[name] = false;
		} catch (error) {
			this.proxyRuleUpdated[name] = error;
			this.proxyRuleUpdating[name] = false;
		};
	}
	async renameProxyRule(name) {
		try {
			this.proxyRuleRenaming[name] = true;
			var newName = this.updatedProxyRuleName[name];
			var response = await axios(`${this.endpoint}/proxy-rule/${encodeURIComponent(name || 'default')}`, { method: 'MOVE', headers: { 'Destination': `/proxy-rule/${encodeURIComponent(newName || 'default')}`, Overwrite: 'F' } });
			this.proxyRuleRenamed[name] = response.data;
			this.proxyRuleRenaming[name] = false;
			this.proxyRule[newName] = this.proxyRule[name];
			delete this.proxyRule[name];
			this.proxyRuleNameEditing[name] = false;
		} catch (error) {
			this.proxyRuleRenamed[name] = error;
			this.proxyRuleRenaming[name] = false;
		};
	}
	render() {
		var proxyRule = this.proxyRule,
			proxyRuleLoading = this.proxyRuleLoading,
			newProxyRule = this.newProxyRule,
			proxyRuleAdding = this.proxyRuleAdding,
			proxyRuleAdded = this.proxyRuleAdded,
			proxyRuleDeleting = this.proxyRuleDeleting,
			proxyRuleDeleted = this.proxyRuleDeleted,
			proxyRuleEditing = this.proxyRuleEditing,
			updatedProxyRule = this.updatedProxyRule,
			proxyRuleUpdating = this.proxyRuleUpdating,
			proxyRuleUpdated = this.proxyRuleUpdated,
			proxyRuleNameEditing = this.proxyRuleNameEditing,
			updatedProxyRuleName = this.updatedProxyRuleName,
			proxyRuleRenaming = this.proxyRuleRenaming,
			proxyRuleRenamed = this.proxyRuleRenamed;
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
						`error: ${proxyRule.response?.data || proxyRule.message}` :
						<>
							<table>
								{
									Object.entries(proxyRule).length ?
										Object.entries(proxyRule)
											.map(([name, value]) => <tr key={name}>
												<td>{
													proxyRuleNameEditing[name] ?
														<input type="text" form={`rename-proxy-rule-${name}`} disabled={proxyRuleRenaming[name]} value={updatedProxyRuleName[name]} onChange={e => { updatedProxyRuleName[name] = e.target.value; }} /> :
														name || "(default)"
												}</td>
												<td>{
													proxyRuleEditing[name] ?
														<input type="text" form={`update-proxy-rule-${name}`} disabled={proxyRuleUpdating[name]} value={updatedProxyRule[name]} onChange={e => { updatedProxyRule[name] = e.target.value; }} /> :
														value
												}</td>
												<td>
													<button title="delete" onClick={this.deleteProxyRule.bind(this, name)}>❌</button>
													{proxyRuleDeleting[name] && "(Deleting..)"}
													{proxyRuleDeleted[name] instanceof Error && `error: ${proxyRuleDeleted[name].response?.data || proxyRuleDeleted[name].message}`}
													{
														proxyRuleEditing[name] && !proxyRuleUpdating[name] ? <>
															<button onClick={() => { proxyRuleEditing[name] = false; }}>cancel</button>
															<button form={`update-proxy-rule-${name}`}>submit</button>
														</> :
															<button title="edit" onClick={() => { updatedProxyRule[name] = proxyRule[name]; proxyRuleEditing[name] = true; }}>🖊</button>
													}
													{proxyRuleUpdating[name] && "(Updating..)"}
													{proxyRuleUpdated[name] instanceof Error && `error: ${proxyRuleUpdated[name].response?.data || proxyRuleUpdated[name].message}`}
													{
														proxyRuleNameEditing[name] && !proxyRuleRenaming[name] ? <>
															<button onClick={() => { proxyRuleNameEditing[name] = false; }}>cancel</button>
															<button form={`rename-proxy-rule-${name}`}>submit</button>
														</> :
															<button onClick={() => { updatedProxyRuleName[name] = name; proxyRuleNameEditing[name] = true; }}>rename</button>
													}
													{proxyRuleRenaming[name] && "(Renaming..)"}
													{proxyRuleRenamed[name] instanceof Error && `error: ${proxyRuleRenamed[name].response?.data || proxyRuleRenamed[name].message}`}
												</td>
												<form id={`update-proxy-rule-${name}`} onSubmit={e => { this.updateProxyRule(name); e.preventDefault(); }}></form>
												<form id={`rename-proxy-rule-${name}`} onSubmit={e => { this.renameProxyRule(name); e.preventDefault(); }}></form>
											</tr>) :
										[<tr><td colSpan={2}>(no proxy rules)</td></tr>]
								}
								<tr>
									<td><input form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.name} onChange={e => { this.newProxyRule.name = e.target.value; }} /></td>
									<td><input form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.value} onChange={e => { this.newProxyRule.value = e.target.value; }} /></td>
									<td>
										{!proxyRuleAdding && <button form="add-proxy-rule" title="add">➕</button>}
										{proxyRuleAdding && "(adding..)"}
										{proxyRuleAdded instanceof Error && `error: ${proxyRuleAdded.response?.data || proxyRuleAdded.message}`}
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

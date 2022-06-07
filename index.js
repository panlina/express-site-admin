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
	@observable vhostLoading = false;
	@observable vhost = undefined;
	@observable newVHost = { name: '', value: '' };
	@observable vhostAdding = false;
	@observable vhostAdded = undefined;
	@observable vhostDeleting = {};
	@observable vhostDeleted = {};
	@observable vhostEditing = {};
	@observable updatedVHost = {};
	@observable vhostUpdating = {};
	@observable vhostUpdated = {};
	@observable vhostNameEditing = {};
	@observable updatedVHostName = {};
	@observable vhostRenaming = {};
	@observable vhostRenamed = {};
	connect() {
		(async () => {
			try {
				this.proxyRuleLoading = true;
				var response = await axios.get(`${this.endpoint}/proxy-rule`);
				this.proxyRule = response.data;
				this.proxyRuleLoading = false;
			} catch (error) {
				this.proxyRule = error;
				this.proxyRuleLoading = false;
			};
		})();
		(async () => {
			try {
				this.vhostLoading = true;
				var response = await axios.get(`${this.endpoint}/vhost`);
				this.vhost = response.data;
				this.vhostLoading = false;
			} catch (error) {
				this.vhost = error;
				this.vhostLoading = false;
			};
		})();
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
	async addVHost() {
		try {
			this.vhostAdding = true;
			var { name, value } = this.newVHost;
			var response = await axios.put(`${this.endpoint}/vhost/${encodeURIComponent(name || 'default')}`, JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
			this.vhostAdded = response.data;
			this.vhostAdding = false;
			this.vhost[name] = value;
			this.newVHost.name = '';
			this.newVHost.value = '';
		} catch (error) {
			this.vhostAdded = error;
			this.vhostAdding = false;
		};
	}
	async deleteVHost(name) {
		try {
			this.vhostDeleting[name] = true;
			var response = await axios.delete(`${this.endpoint}/vhost/${encodeURIComponent(name || 'default')}`);
			this.vhostDeleted[name] = response.data;
			this.vhostDeleting[name] = false;
			delete this.vhost[name];
		} catch (error) {
			this.vhostDeleted[name] = error;
			this.vhostDeleting[name] = false;
		};
	}
	async updateVHost(name) {
		try {
			this.vhostUpdating[name] = true;
			var response = await axios.put(`${this.endpoint}/vhost/${encodeURIComponent(name || 'default')}`, JSON.stringify(this.updatedVHost[name]), { headers: { 'Content-Type': 'application/json' } });
			this.vhostUpdated[name] = response.data;
			this.vhostUpdating[name] = false;
			this.vhost[name] = this.updatedVHost[name];
			this.vhostEditing[name] = false;
		} catch (error) {
			this.vhostUpdated[name] = error;
			this.vhostUpdating[name] = false;
		};
	}
	async renameVHost(name) {
		try {
			this.vhostRenaming[name] = true;
			var newName = this.updatedVHostName[name];
			var response = await axios(`${this.endpoint}/vhost/${encodeURIComponent(name || 'default')}`, { method: 'MOVE', headers: { 'Destination': `/vhost/${encodeURIComponent(newName || 'default')}`, Overwrite: 'F' } });
			this.vhostRenamed[name] = response.data;
			this.vhostRenaming[name] = false;
			this.vhost[newName] = this.vhost[name];
			delete this.vhost[name];
			this.vhostNameEditing[name] = false;
		} catch (error) {
			this.vhostRenamed[name] = error;
			this.vhostRenaming[name] = false;
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
		var vhost = this.vhost,
			vhostLoading = this.vhostLoading,
			newVHost = this.newVHost,
			vhostAdding = this.vhostAdding,
			vhostAdded = this.vhostAdded,
			vhostDeleting = this.vhostDeleting,
			vhostDeleted = this.vhostDeleted,
			vhostEditing = this.vhostEditing,
			updatedVHost = this.updatedVHost,
			vhostUpdating = this.vhostUpdating,
			vhostUpdated = this.vhostUpdated,
			vhostNameEditing = this.vhostNameEditing,
			updatedVHostName = this.updatedVHostName,
			vhostRenaming = this.vhostRenaming,
			vhostRenamed = this.vhostRenamed;
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
									<td><input type="text" form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.name} onChange={e => { this.newProxyRule.name = e.target.value; }} /></td>
									<td><input type="text" form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.value} onChange={e => { this.newProxyRule.value = e.target.value; }} /></td>
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
			<section>
				<h4>vhost</h4>
				<p>{vhostLoading && "loading..."}</p>
				{vhost && (
					vhost instanceof Error ?
						`error: ${vhost.response?.data || vhost.message}` :
						<>
							<table>
								{
									Object.entries(vhost).length ?
										Object.entries(vhost)
											.map(([name, value]) => <tr key={name}>
												<td>{
													vhostNameEditing[name] ?
														<input type="text" form={`rename-vhost-${name}`} disabled={vhostRenaming[name]} value={updatedVHostName[name]} onChange={e => { updatedVHostName[name] = e.target.value; }} /> :
														name || "(default)"
												}</td>
												<td>{
													vhostEditing[name] ?
														<input type="text" form={`update-vhost-${name}`} disabled={vhostUpdating[name]} value={updatedVHost[name]} onChange={e => { updatedVHost[name] = e.target.value; }} /> :
														value
												}</td>
												<td>
													<button title="delete" onClick={this.deleteVHost.bind(this, name)}>❌</button>
													{vhostDeleting[name] && "(Deleting..)"}
													{vhostDeleted[name] instanceof Error && `error: ${vhostDeleted[name].response?.data || vhostDeleted[name].message}`}
													{
														vhostEditing[name] && !vhostUpdating[name] ? <>
															<button onClick={() => { vhostEditing[name] = false; }}>cancel</button>
															<button form={`update-vhost-${name}`}>submit</button>
														</> :
															<button title="edit" onClick={() => { updatedVHost[name] = vhost[name]; vhostEditing[name] = true; }}>🖊</button>
													}
													{vhostUpdating[name] && "(Updating..)"}
													{vhostUpdated[name] instanceof Error && `error: ${vhostUpdated[name].response?.data || vhostUpdated[name].message}`}
													{
														vhostNameEditing[name] && !vhostRenaming[name] ? <>
															<button onClick={() => { vhostNameEditing[name] = false; }}>cancel</button>
															<button form={`rename-vhost-${name}`}>submit</button>
														</> :
															<button onClick={() => { updatedVHostName[name] = name; vhostNameEditing[name] = true; }}>rename</button>
													}
													{vhostRenaming[name] && "(Renaming..)"}
													{vhostRenamed[name] instanceof Error && `error: ${vhostRenamed[name].response?.data || vhostRenamed[name].message}`}
												</td>
												<form id={`update-vhost-${name}`} onSubmit={e => { this.updateVHost(name); e.preventDefault(); }}></form>
												<form id={`rename-vhost-${name}`} onSubmit={e => { this.renameVHost(name); e.preventDefault(); }}></form>
											</tr>) :
										[<tr><td colSpan={2}>(no vhosts)</td></tr>]
								}
								<tr>
									<td><input type="text" form="add-vhost" disabled={vhostAdding} value={newVHost.name} onChange={e => { this.newVHost.name = e.target.value; }} /></td>
									<td><input type="text" form="add-vhost" disabled={vhostAdding} value={newVHost.value} onChange={e => { this.newVHost.value = e.target.value; }} /></td>
									<td>
										{!vhostAdding && <button form="add-vhost" title="add">➕</button>}
										{vhostAdding && "(adding..)"}
										{vhostAdded instanceof Error && `error: ${vhostAdded.response?.data || vhostAdded.message}`}
									</td>
								</tr>
							</table>
							<form id="add-vhost" onSubmit={e => { this.addVHost(); e.preventDefault(); }}></form>
						</>
				)}
			</section>
		</>;
	}
}

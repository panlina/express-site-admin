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
	@observable appLoading = false;
	@observable app = undefined;
	@observable newApp = { name: '', value: { type: 'standalone', module: "", arguments: "", cwd: "", env: "", port: '' } };
	@observable appAdding = false;
	@observable appAdded = undefined;
	@observable appDeleting = {};
	@observable appDeleted = {};
	@observable appEditing = {};
	@observable updatedApp = {};
	@observable appUpdating = {};
	@observable appUpdated = {};
	@observable appNameEditing = {};
	@observable updatedAppName = {};
	@observable appRenaming = {};
	@observable appRenamed = {};
	@observable appStarting = {};
	@observable appStarted = {};
	@observable appStopping = {};
	@observable appStopped = {};
	@observable moduleLoading = false;
	@observable module = undefined;
	@observable newModule = { value: { source: '' } };
	@observable moduleAdding = false;
	@observable moduleAdded = undefined;
	@observable moduleDeleting = {};
	@observable moduleDeleted = {};
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
		(async () => {
			try {
				this.appLoading = true;
				var response = await axios.get(`${this.endpoint}/app`);
				this.app = response.data;
				this.appLoading = false;
			} catch (error) {
				this.app = error;
				this.appLoading = false;
			};
		})();
		(async () => {
			try {
				this.moduleLoading = true;
				var response = await axios.get(`${this.endpoint}/module`);
				this.module = response.data;
				this.moduleLoading = false;
			} catch (error) {
				this.module = error;
				this.moduleLoading = false;
			};
		})();
		this.eventSource && this.eventSource.close();
		this.eventSource = new EventSource(`${this.endpoint}/event/`, { withCredentials: true });
		this.eventSource.addEventListener('stop', e => {
			var [source, data] = e.data.split('\n');
			data = JSON.parse(data);
			var [, type, name] = source.split('/');
			if (type == 'app')
				this.app[name].running = false;
		});
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
			setTimeout(() => {
				document.getElementById('add-proxy-rule').elements[0].focus();
			}, 0);
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
			setTimeout(() => {
				document.getElementById('add-vhost').elements[0].focus();
			}, 0);
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
	async addApp() {
		try {
			var { name, value } = this.newApp;
			try {
				var value = this.appEditingStateToValue(value);
			}
			catch (e) {
				alert(e);
				return;
			}
			this.appAdding = true;
			var response = await axios.put(`${this.endpoint}/app/${encodeURIComponent(name || 'default')}`, JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
			this.appAdded = response.data;
			this.appAdding = false;
			this.app[name] = value;
			this.newApp.name = '';
			this.newApp.value = { type: 'standalone', module: "", arguments: "", cwd: "", env: "", port: '' };
			setTimeout(() => {
				document.getElementById('add-app').elements[0].focus();
			}, 0);
		} catch (error) {
			this.appAdded = error;
			this.appAdding = false;
		};
	}
	async deleteApp(name) {
		try {
			this.appDeleting[name] = true;
			var response = await axios.delete(`${this.endpoint}/app/${encodeURIComponent(name || 'default')}`);
			this.appDeleted[name] = response.data;
			this.appDeleting[name] = false;
			delete this.app[name];
		} catch (error) {
			this.appDeleted[name] = error;
			this.appDeleting[name] = false;
		};
	}
	appEditingStateToValue(app) {
		try { JSON.parse(app.arguments); }
		catch (e) { throw "arguments is not valid."; }
		try { JSON.parse(app.env); }
		catch (e) { throw "env is not valid."; }
		if (app.port && isNaN(+app.port))
			throw "port is not valid.";
		return {
			...app,
			arguments: JSON.parse(app.arguments),
			cwd: app.cwd || null,
			env: JSON.parse(app.env),
			port: app.port ? +app.port : null
		};
	}
	appValueToEditingState(app) {
		return {
			...app,
			arguments: JSON.stringify(app.arguments),
			cwd: app.cwd || "",
			env: JSON.stringify(app.env),
			port: app.port != null ? app.port.toString() : ''
		};
	}
	async updateApp(name) {
		try {
			try {
				var value = this.appEditingStateToValue(this.updatedApp[name]);
			}
			catch (e) {
				alert(e);
				return;
			}
			this.appUpdating[name] = true;
			var response = await axios.put(`${this.endpoint}/app/${encodeURIComponent(name || 'default')}`, JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
			this.appUpdated[name] = response.data;
			this.appUpdating[name] = false;
			this.app[name] = value;
			this.appEditing[name] = false;
		} catch (error) {
			this.appUpdated[name] = error;
			this.appUpdating[name] = false;
		};
	}
	async renameApp(name) {
		try {
			this.appRenaming[name] = true;
			var newName = this.updatedAppName[name];
			var response = await axios(`${this.endpoint}/app/${encodeURIComponent(name || 'default')}`, { method: 'MOVE', headers: { 'Destination': `/app/${encodeURIComponent(newName || 'default')}`, Overwrite: 'F' } });
			this.appRenamed[name] = response.data;
			this.appRenaming[name] = false;
			this.app[newName] = this.app[name];
			delete this.app[name];
			this.appNameEditing[name] = false;
		} catch (error) {
			this.appRenamed[name] = error;
			this.appRenaming[name] = false;
		};
	}
	async start(name) {
		try {
			var app = this.app[name];
			this.appStarting[name] = true;
			this.appStarted[name] = await axios.post(`${this.endpoint}/app/${encodeURIComponent(name || 'default')}/start`);
			this.appStarting[name] = false;
			app.running = true;
		}
		catch (error) {
			this.appStarted[name] = error;
			this.appStarting[name] = false;
		}
	}
	async stop(name) {
		try {
			var app = this.app[name];
			this.appStopping[name] = true;
			this.appStopped[name] = await axios.post(`${this.endpoint}/app/${encodeURIComponent(name || 'default')}/stop`);
			this.appStopping[name] = false;
			app.running = false;
		}
		catch (error) {
			this.appStopped[name] = error;
			this.appStopping[name] = false;
		}
	}
	async addModule() {
		try {
			this.moduleAdding = true;
			var { value } = this.newModule;
			var response = await axios.post(`${this.endpoint}/module/`, JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
			this.moduleAdded = response.data;
			this.moduleAdding = false;
			var location = response.headers['location'];
			var name = location.substr(location.indexOf('/', 1) + 1);
			this.module[name] = value;
			this.newModule.value = { source: '' };
			setTimeout(() => {
				document.getElementById('add-module').elements[0].focus();
			}, 0);
		} catch (error) {
			this.moduleAdded = error;
			this.moduleAdding = false;
		};
	}
	async deleteModule(name) {
		try {
			this.moduleDeleting[name] = true;
			var response = await axios.delete(`${this.endpoint}/module/${encodeURIComponent(name)}`);
			this.moduleDeleted[name] = response.data;
			this.moduleDeleting[name] = false;
			delete this.module[name];
		} catch (error) {
			this.moduleDeleted[name] = error;
			this.moduleDeleting[name] = false;
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
		var app = this.app,
			appLoading = this.appLoading,
			newApp = this.newApp,
			appAdding = this.appAdding,
			appAdded = this.appAdded,
			appDeleting = this.appDeleting,
			appDeleted = this.appDeleted,
			appEditing = this.appEditing,
			updatedApp = this.updatedApp,
			appUpdating = this.appUpdating,
			appUpdated = this.appUpdated,
			appNameEditing = this.appNameEditing,
			updatedAppName = this.updatedAppName,
			appRenaming = this.appRenaming,
			appRenamed = this.appRenamed;
		var module = this.module,
			moduleLoading = this.moduleLoading,
			newModule = this.newModule,
			moduleAdding = this.moduleAdding,
			moduleAdded = this.moduleAdded,
			moduleDeleting = this.moduleDeleting,
			moduleDeleted = this.moduleDeleted;
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
													{proxyRuleDeleting[name] && "(deleting..)"}
													{proxyRuleDeleted[name] instanceof Error && `error: ${proxyRuleDeleted[name].response?.data || proxyRuleDeleted[name].message}`}
													{
														proxyRuleEditing[name] && !proxyRuleUpdating[name] ? <>
															<button onClick={() => { proxyRuleEditing[name] = false; }}>cancel</button>
															<button form={`update-proxy-rule-${name}`}>submit</button>
														</> :
															<button title="edit" onClick={() => { updatedProxyRule[name] = proxyRule[name]; proxyRuleEditing[name] = true; }}>🖊</button>
													}
													{proxyRuleUpdating[name] && "(updating..)"}
													{proxyRuleUpdated[name] instanceof Error && `error: ${proxyRuleUpdated[name].response?.data || proxyRuleUpdated[name].message}`}
													{
														proxyRuleNameEditing[name] && !proxyRuleRenaming[name] ? <>
															<button onClick={() => { proxyRuleNameEditing[name] = false; }}>cancel</button>
															<button form={`rename-proxy-rule-${name}`}>submit</button>
														</> :
															<button onClick={() => { updatedProxyRuleName[name] = name; proxyRuleNameEditing[name] = true; }}>rename</button>
													}
													{proxyRuleRenaming[name] && "(renaming..)"}
													{proxyRuleRenamed[name] instanceof Error && `error: ${proxyRuleRenamed[name].response?.data || proxyRuleRenamed[name].message}`}
												</td>
												<form id={`update-proxy-rule-${name}`} onSubmit={e => { this.updateProxyRule(name); e.preventDefault(); }}></form>
												<form id={`rename-proxy-rule-${name}`} onSubmit={e => { this.renameProxyRule(name); e.preventDefault(); }}></form>
											</tr>) :
										[<tr><td colSpan={2}>(no proxy rules)</td></tr>]
								}
								<tr>
									<td><input type="text" form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.name} onChange={e => { newProxyRule.name = e.target.value; }} /></td>
									<td><input type="text" form="add-proxy-rule" disabled={proxyRuleAdding} value={newProxyRule.value} onChange={e => { newProxyRule.value = e.target.value; }} /></td>
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
													{vhostDeleting[name] && "(deleting..)"}
													{vhostDeleted[name] instanceof Error && `error: ${vhostDeleted[name].response?.data || vhostDeleted[name].message}`}
													{
														vhostEditing[name] && !vhostUpdating[name] ? <>
															<button onClick={() => { vhostEditing[name] = false; }}>cancel</button>
															<button form={`update-vhost-${name}`}>submit</button>
														</> :
															<button title="edit" onClick={() => { updatedVHost[name] = vhost[name]; vhostEditing[name] = true; }}>🖊</button>
													}
													{vhostUpdating[name] && "(updating..)"}
													{vhostUpdated[name] instanceof Error && `error: ${vhostUpdated[name].response?.data || vhostUpdated[name].message}`}
													{
														vhostNameEditing[name] && !vhostRenaming[name] ? <>
															<button onClick={() => { vhostNameEditing[name] = false; }}>cancel</button>
															<button form={`rename-vhost-${name}`}>submit</button>
														</> :
															<button onClick={() => { updatedVHostName[name] = name; vhostNameEditing[name] = true; }}>rename</button>
													}
													{vhostRenaming[name] && "(renaming..)"}
													{vhostRenamed[name] instanceof Error && `error: ${vhostRenamed[name].response?.data || vhostRenamed[name].message}`}
												</td>
												<form id={`update-vhost-${name}`} onSubmit={e => { this.updateVHost(name); e.preventDefault(); }}></form>
												<form id={`rename-vhost-${name}`} onSubmit={e => { this.renameVHost(name); e.preventDefault(); }}></form>
											</tr>) :
										[<tr><td colSpan={2}>(no vhosts)</td></tr>]
								}
								<tr>
									<td><input type="text" form="add-vhost" disabled={vhostAdding} value={newVHost.name} onChange={e => { newVHost.name = e.target.value; }} /></td>
									<td><input type="text" form="add-vhost" disabled={vhostAdding} value={newVHost.value} onChange={e => { newVHost.value = e.target.value; }} /></td>
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
			<section>
				<h4>app</h4>
				<p>{appLoading && "loading..."}</p>
				{app && (
					app instanceof Error ?
						`error: ${app.response?.data || app.message}` :
						<>
							<table>
								{
									Object.entries(app).length ?
										Object.entries(app)
											.map(([name, value]) => <tr key={name}>
												<td>{
													appNameEditing[name] ?
														<input type="text" form={`rename-app-${name}`} disabled={appRenaming[name]} value={updatedAppName[name]} onChange={e => { updatedAppName[name] = e.target.value; }} /> :
														name || "(default)"
												}</td>
												<td>{
													appEditing[name] ?
														<select form={`update-app-${name}`} required disabled={appUpdating[name]} value={updatedApp[name].type} onChange={e => { updatedApp[name].type = e.target.value; }}>
															<option>middleware</option>
															<option>standalone</option>
															<option>npm-start</option>
														</select> :
														value.type
												}</td>
												<td>{
													appEditing[name] ?
														<input type="text" form={`update-app-${name}`} disabled={appUpdating[name]} value={updatedApp[name].module} onChange={e => { updatedApp[name].module = e.target.value; }} /> :
														value.module
												}</td>
												<td>{
													appEditing[name] ?
														<input type="text" form={`update-app-${name}`} disabled={appUpdating[name]} value={updatedApp[name].arguments} onChange={e => { updatedApp[name].arguments = e.target.value; }} /> :
														JSON.stringify(value.arguments)
												}</td>
												<td>{
													appEditing[name] ?
														<input type="text" form={`update-app-${name}`} disabled={appUpdating[name]} value={updatedApp[name].cwd} onChange={e => { updatedApp[name].cwd = e.target.value; }} /> :
														value.cwd
												}</td>
												<td>{
													appEditing[name] ?
														<input type="text" form={`update-app-${name}`} disabled={appUpdating[name]} value={updatedApp[name].env} onChange={e => { updatedApp[name].env = e.target.value; }} /> :
														JSON.stringify(value.env)
												}</td>
												<td>{
													appEditing[name] ?
														<input type="number" min="0" max="65535" form={`update-app-${name}`} disabled={appUpdating[name]} value={updatedApp[name].port} onChange={e => { updatedApp[name].port = e.target.value; }} /> :
														value.port
												}</td>
												<td>
													{value.running ? "running" : "not running"}
													{this.appStopping[name] && "(stopping..)"}
													{this.appStopped[name] instanceof Error && `error: ${this.appStopped[name].response?.data || this.appStopped[name].message}`}
													{this.appStarting[name] && "(starting..)"}
													{this.appStarted[name] instanceof Error && `error: ${this.appStarted[name].response?.data || this.appStarted[name].message}`}
													{value.running && !this.appStopping[name] && <button onClick={() => { this.stop(name); }} title="stop">⏹</button>}
													{!value.running && !this.appStarting[name] && <button onClick={() => { this.start(name); }} title="start">▶️</button>}
													<button title="delete" onClick={this.deleteApp.bind(this, name)}>❌</button>
													{appDeleting[name] && "(deleting..)"}
													{appDeleted[name] instanceof Error && `error: ${appDeleted[name].response?.data || appDeleted[name].message}`}
													{
														appEditing[name] && !appUpdating[name] ? <>
															<button onClick={() => { appEditing[name] = false; }}>cancel</button>
															<button form={`update-app-${name}`}>submit</button>
														</> :
															<button title="edit" onClick={() => { updatedApp[name] = this.appValueToEditingState(app[name]); appEditing[name] = true; }}>🖊</button>
													}
													{appUpdating[name] && "(updating..)"}
													{appUpdated[name] instanceof Error && `error: ${appUpdated[name].response?.data || appUpdated[name].message}`}
													{
														appNameEditing[name] && !appRenaming[name] ? <>
															<button onClick={() => { appNameEditing[name] = false; }}>cancel</button>
															<button form={`rename-app-${name}`}>submit</button>
														</> :
															<button onClick={() => { updatedAppName[name] = name; appNameEditing[name] = true; }}>rename</button>
													}
													{appRenaming[name] && "(renaming..)"}
													{appRenamed[name] instanceof Error && `error: ${appRenamed[name].response?.data || appRenamed[name].message}`}
												</td>
												<form id={`update-app-${name}`} onSubmit={e => { this.updateApp(name); e.preventDefault(); }}></form>
												<form id={`rename-app-${name}`} onSubmit={e => { this.renameApp(name); e.preventDefault(); }}></form>
											</tr>) :
										[<tr><td colSpan={7}>(no apps)</td></tr>]
								}
								<tr>
									<td><input type="text" form="add-app" disabled={appAdding} value={newApp.name} onChange={e => { newApp.name = e.target.value; }} /></td>
									<td><select form="add-app" required disabled={appAdding} value={newApp.value.type} onChange={e => { newApp.value.type = e.target.value; }}>
										<option>middleware</option>
										<option>standalone</option>
										<option>npm-start</option>
									</select></td>
									<td><input type="text" form="add-app" disabled={appAdding} value={newApp.value.module} onChange={e => { newApp.value.module = e.target.value; }} /></td>
									<td><input type="text" form="add-app" disabled={appAdding} value={newApp.value.arguments} onChange={e => { newApp.value.arguments = e.target.value; }} /></td>
									<td><input type="text" form="add-app" disabled={appAdding} value={newApp.value.cwd} onChange={e => { newApp.value.cwd = e.target.value; }} /></td>
									<td><input type="text" form="add-app" disabled={appAdding} value={newApp.value.env} onChange={e => { newApp.value.env = e.target.value; }} /></td>
									<td><input type="number" min="0" max="65535" form="add-app" disabled={appAdding} value={newApp.value.port} onChange={e => { newApp.value.port = e.target.value; }} /></td>
									<td>
										{!appAdding && <button form="add-app" title="add">➕</button>}
										{appAdding && "(adding..)"}
										{appAdded instanceof Error && `error: ${appAdded.response?.data || appAdded.message}`}
									</td>
								</tr>
							</table>
							<form id="add-app" onSubmit={e => { this.addApp(); e.preventDefault(); }}></form>
						</>
				)}
			</section>
			<section>
				<h4>module</h4>
				<p>{moduleLoading && "loading..."}</p>
				{module && (
					module instanceof Error ?
						`error: ${module.response?.data || module.message}` :
						<>
							<table>
								{
									Object.entries(module).length ?
										Object.entries(module)
											.map(([name, value]) => <tr key={name}>
												<td>{name}</td>
												<td>{value.source}</td>
												<td>
													<button title="delete" onClick={this.deleteModule.bind(this, name)}>❌</button>
													{moduleDeleting[name] && "(deleting..)"}
													{moduleDeleted[name] instanceof Error && `error: ${moduleDeleted[name].response?.data || moduleDeleted[name].message}`}
												</td>
											</tr>) :
										[<tr><td colSpan={2}>(no modules)</td></tr>]
								}
								<tr>
									<td></td>
									<td><input type="text" form="add-module" disabled={moduleAdding} value={newModule.value.source} onChange={e => { newModule.value.source = e.target.value; }} /></td>
									<td>
										{!moduleAdding && <button form="add-module" title="add">➕</button>}
										{moduleAdding && "(adding..)"}
										{moduleAdded instanceof Error && `error: ${moduleAdded.response?.data || moduleAdded.message}`}
									</td>
								</tr>
							</table>
							<form id="add-module" onSubmit={e => { this.addModule(); e.preventDefault(); }}></form>
						</>
				)}
			</section>
		</>;
	}
}

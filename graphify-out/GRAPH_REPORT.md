# Graph Report - .  (2026-07-27)

## Corpus Check
- 300 files · ~456,485 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 992 nodes · 1053 edges · 149 communities (79 shown, 70 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 191 edges (avg confidence: 0.87)
- Token cost: 1,475,161 input · 0 output

## Community Hubs (Navigation)
- MSK Garage Releases & Job Hooks
- MSK Core Ace & Commands
- MSK Core NUI Modules
- Banking & Core Releases
- Ticketbot Dashboard
- Ecosystem Hosting & APIs
- CI Security Workflows
- Config & Integration Basics
- Discord Giveaway Bot
- Docusaurus Dependencies
- MSK Fuel Exports
- CSP Generation Script
- VehicleKeys Installation
- Context & Menu Modules
- Handcuffs Status Restore
- Handcuffs Admin & Config
- Dev Dependencies
- Callback System & Shared Modules
- Yarn Resolutions
- MSK Simcard Config
- MSK Forms Builder & Bot
- VehicleKeys Admin Dashboard
- VehicleKeys Key Exports
- MSK Ecosystem Stacks
- MSK Forms Integrations & API
- npm Scripts
- Handcuffs Commands & Exports
- Handcuffs Settings & Items
- VehicleKeys NUI & Locksmith
- MSK Paste REST API
- MSK Shortener REST API
- Browserslist Targets
- EngineToggle Integrations
- Garage Job Vehicle Config
- Handcuffs Server Exports
- MSK Paste Web Features
- Shortener SSRF & Stack
- Docusaurus Homepage
- Entity Proximity Helpers
- Callback & Timeout Primitives
- Radio Channels & Voice
- VehicleKeys Refresh & Config
- VehicleKeys Key Types
- Delete Token Pattern
- Rate Limiting & Webhooks
- IP Hashing & Statistics
- Entity Lookup Helpers
- Radio Channel Passwords
- VehicleKeys Admin Vehicles
- Forms Custom Domains
- Privacy & CSP Hardening
- Forms Upload & GDPR
- Forms Plans & Teams
- MSKanban Deployment & 2FA
- package.json Metadata
- Server UI Wrappers
- Version Checker
- Fuel Commands & Config
- Fuel Types & Engine Failure
- Garage AdvancedParking
- Garage Job Garages & Theme
- Radio Channel Exports
- VehicleKeys Storage Migration
- Shortener Links & Clicks
- MSKanban Board Views
- Banking Client Callbacks
- MSK Ban System
- MSK Table Helpers
- Handcuffs Trust Model
- Release Body Generation (Commits
- Inline Schema Migrations on
- msk_banking:setSharedAccountMoney event handler
- MSK.GetRegisteredItems
- Atomic SQL Deduction Guard
- exports.msk_core:GetLib
- Inverted Trim Boolean Semantic
- Config.showKeyOwnerName
- msk_radio isRadioOpen (client export)
- msk_vehiclekeys RemoveAllExistingKeys (server export)
- Datenschutz Page
- Impressum Page
- Homepage Footer
- Winner DMs and Ending-Soon
- Auto-Close of Inactive Tickets
- Panel Interaction Type (BUTTON
- ticketActions Core Logic (openTicket,
- MSK.Points.GetAllPoints
- MSK.GetVehicleInDirection
- MSK.GetVehicleLabelFromModel
- MSK.Table.DumpString
- MSK.Timeout.Clear
- MSK.Vector.VectorToVector
- msk_enginetoggle:enteredVehicle (client)
- msk_enginetoggle:exitedVehicle (client)
- msk_fuel client export IsFuelTypeAtFuelStation
- putPlayerOutOfCar client export
- msk_handcuffs:requestPutInCar
- msk_radio getRadioVolume (client export)
- Metadata-based unique key items
- docusaurus.config.ts
- Public form hub
- Shortener Language Switcher (cookie
- AGPL-3.0-or-later Licensing
- Shortener CSP and Security
- MSKanban STRIDE Threat Model
- sidebars.ts
- sidebars-discord.ts
- sidebars-ecosystem.ts
- sidebars-guides.ts
- Bug Report Issue Template
- Feature Request Issue Template
- Rating System
- Config.BanSystem
- Config.DisconnectLogger
- MSK.Spinner
- MSK.Scaleform.BreakingNews
- MSK.GetPedMugshot
- MSK.Offline.AddBank
- MSK.GetPlayerJobByCitizenId
- MSK.GetPlayerJobFromIdentifier
- MSK.Scaleform.TrafficMovie
- MSK.Society.AddMoney
- MSK.Context.Hide (server)
- MSK.Input.Close (server)
- MSK.Menu.Hide (server)
- MSK.Numpad.Close (server)
- MSK.Progress.Stop (server)
- MSK.TextUI.Hide (server)
- MSK.AddWebhook
- MSK.Math.Comma
- MSK.Math.Round
- MSK.String.Split
- MSK.String.StartsWith
- MSK.Table.Clone
- MSK.Table.Reverse
- MSK.Table.Size
- MSK.Table.Sort
- msk_fuel client export GetVehicleFuelTankBoneIndex
- msk_fuel client export GetVehicleFuelType
- msk_fuel client export GetVehicleMaxFuel
- msk_fuel client export SetVehicleMaxFuel
- msk_radio Config.Notification hook
- msk_radio isEncryptedChannel (client export)
- msk_radio setRadioSpeaker (client export)
- msk_vehiclekeys v1.4.0
- msk_vehiclekeys GetPlayerKeys (client export)
- msk_vehiclekeys HasPlayerKeyOrIsVehicleOwner (client export)
- Idempotent Migration Runner (_migrations

## God Nodes (most connected - your core abstractions)
1. `resolutions` - 13 edges
2. `MSK Forms` - 12 edges
3. `scripts` - 11 edges
4. `msk_core Client Functions Overview` - 11 edges
5. `Server Functions Overview` - 11 edges
6. `MSK Paste (web interface)` - 10 edges
7. `msk_core Framework & Inventory Bridge` - 9 edges
8. `MSK Handcuffs` - 9 edges
9. `config/settings.lua` - 9 edges
10. `MSK Shortener REST API` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Multi-Bot .env Configuration Reference` --semantically_similar_to--> `Dependabot Configuration`  [INFERRED] [semantically similar]
  discord/discord_multibot/configuration.md → .github/dependabot.yml
- `whitelistPlayer (server export)` --semantically_similar_to--> `Automatic accepted-role grants`  [INFERRED] [semantically similar]
  docs/msk_whitelist/exports/server.md → ecosystem/msk-forms/discord-bot.md
- `Transitive Dependency Pinning via package.json resolutions` --semantically_similar_to--> `Major Version Bump Ignore Policy`  [INFERRED] [semantically similar]
  SECURITY.md → .github/dependabot.yml
- `MSK Scripts Guides Landing Page` --conceptually_related_to--> `MSK Shortener`  [AMBIGUOUS]
  guides/intro.md → ecosystem/msk-shortener/index.md
- `Config.EncryptedChannels (job-restricted radio channels)` --semantically_similar_to--> `Config.RestrictItems`  [INFERRED] [semantically similar]
  docs/msk_radio/config.md → docs/msk_handcuffs/config.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Supply-Chain & Code Security Pipeline** — security_security_policy, _github_dependabot_dependabot_config, _github_workflows_codeql_codeql_advanced_workflow, _github_workflows_dependency_review_dependency_review_workflow, security_resolutions_pinning_strategy [INFERRED 0.85]
- **Build-to-vhost CSP Hash Flow** — readme_yarn_build_workflow, apache_readme_generate_csp_mjs, _github_workflows_deploy_postdeploy_csp_snippet_install, apache_readme_apache_vhost_setup, apache_readme_hash_based_csp_strategy [EXTRACTED 1.00]
- **Giveaway Eligibility and Winner Draw Flow** — discord_discord_giveaway_configuration_eligibility_rules, discord_discord_giveaway_configuration_weighted_bonus_entries, discord_discord_giveaway_configuration_per_giveaway_scope_override, discord_discord_giveaway_commands_giveaway_lifecycle, discord_discord_giveaway_configuration_winner_dm_and_reminder [EXTRACTED 1.00]
- **Securely exposing the ticket bot dashboard** — discord_discord_ticketbot_dashboard_safe_by_default, discord_discord_ticketbot_guides_dashboard_linux_two_layer_model, discord_discord_ticketbot_guides_dashboard_linux_firewall_rules, discord_discord_ticketbot_dashboard_discord_oauth_login, discord_discord_ticketbot_dashboard_parent_process_architecture [EXTRACTED 1.00]
- **MSK Transcript Service premium onboarding flow** — discord_discord_ticketbot_service_setup_service_setup_en_stripe_billing, discord_discord_ticketbot_service_setup_service_setup_en_discord_verify_oauth_app, discord_discord_ticketbot_service_setup_service_setup_en_subscription_tiers, discord_discord_ticketbot_service_setup_service_setup_en_custom_domain, discord_discord_ticketbot_getting_started_hosted_bot_management [EXTRACTED 1.00]
- **MSK Banking society account system** — docs_msk_banking_config_society, docs_msk_banking_server_callbacks_getsocietyaccounts, docs_msk_banking_exports_client_getsocietyinfo, docs_msk_banking_exports_server_getsocietylabel, docs_msk_banking_installation_index_addsharedaccount [INFERRED 0.85]
- **msk_core Bridge Abstraction Layer** — docs_msk_core_frameworks_auto_detection, docs_msk_core_frameworks_standalone_mode, docs_msk_core_frameworks_inventory_bridge, docs_msk_core_frameworks_msk_bridge, docs_msk_core_frameworks_normalized_events, docs_msk_core_configuration_config_framework, docs_msk_core_configuration_config_inventory [EXTRACTED 1.00]
- **Asset Streaming Helpers Built on MSK.Request.Streaming** — docs_msk_core_functions_client_request_streaming, docs_msk_core_functions_client_request_scaleformmovie, docs_msk_core_functions_client_request_animdict, docs_msk_core_functions_client_request_model [EXTRACTED 1.00]
- **Core Singleton Threads and Their Broadcast Events** — docs_msk_core_functions_client_entities_single_core_thread, docs_msk_core_functions_client_entities_onplayerdeath, docs_msk_core_functions_client_vehicle_vehicle_events, docs_msk_core_functions_client_player_onplayer_event, docs_msk_core_changelog_v3_0_1_shared_registration_guard [INFERRED 0.85]
- **MSK Core NUI UI Module Family** — docs_msk_core_functions_client_ui_context_module, docs_msk_core_functions_client_ui_menu_module, docs_msk_core_functions_client_ui_input_module, docs_msk_core_functions_client_ui_numpad_module, docs_msk_core_functions_client_ui_progressbar_module, docs_msk_core_functions_client_ui_textui_module [INFERRED 0.85]
- **Ace-Restricted Command Authorization Flow** — docs_msk_core_functions_server_commands_registercommand, docs_msk_core_functions_server_ace_permission_addace, docs_msk_core_functions_server_ace_permission_isaceallowed, docs_msk_core_functions_server_ace_permission_principal_normalization, docs_msk_core_functions_server_ban_system_module, docs_msk_core_functions_client_coords_show [EXTRACTED 1.00]
- **Proximity Query Helper Family** — docs_msk_core_functions_client_entities_getclosestentity, docs_msk_core_functions_client_entities_getclosestentities, docs_msk_core_functions_client_vehicle_getclosestvehicle, docs_msk_core_functions_client_vehicle_getclosestvehicles, docs_msk_core_functions_client_world_getclosestplayer, docs_msk_core_functions_client_world_getclosestplayers [EXTRACTED 1.00]
- **Server-side UI modules forwarding to the client via the MSK callback system** — docs_msk_core_functions_server_ui_context_msk_context_show, docs_msk_core_functions_server_ui_input_msk_input_open, docs_msk_core_functions_server_ui_menu_msk_menu_show, docs_msk_core_functions_server_ui_numpad_msk_numpad_open, docs_msk_core_functions_shared_callback_msk_callback_system [EXTRACTED 1.00]
- **Vehicle enter/exit lifecycle event payload shared by client and server handlers** — docs_msk_enginetoggle_event_handler_client_enteringvehicle, docs_msk_enginetoggle_event_handler_client_enteredvehicle, docs_msk_enginetoggle_event_handler_client_exitedvehicle, docs_msk_enginetoggle_event_handler_server_enteringvehicle, docs_msk_enginetoggle_event_handler_server_enteredvehicle, docs_msk_enginetoggle_event_handler_server_exitedvehicle, docs_msk_enginetoggle_exports_client_setvehicledamaged [EXTRACTED 1.00]
- **Backwards-compatible flat/legacy aliases kept alongside namespaced v3 API** — docs_msk_core_functions_shared_string_msk_string_trimlegacy, docs_msk_core_functions_shared_vector_namespaced_naming_migration, docs_msk_core_functions_server_ui_context_msk_context_show, docs_msk_core_functions_server_ui_menu_msk_menu_show, docs_msk_core_functions_shared_timeout_msk_timeout_set [INFERRED 0.85]
- **Config seed to database authority flow** — docs_msk_garage_config_config_as_seed, docs_msk_garage_database_one_time_seed_marker, docs_msk_garage_database_dashboard_tables, docs_msk_garage_dashboard_admin_dashboard [EXTRACTED 1.00]
- **Server-registered custom garage/impound flow** — docs_msk_garage_exports_server_registercustomgarage, docs_msk_garage_exports_server_registercustomimpound, docs_msk_garage_exports_server_clearcustomsession, docs_msk_garage_exports_client_opengarage, docs_msk_garage_exports_client_openimpound [EXTRACTED 1.00]
- **msk_fuel state accessor exports over StateBags** — docs_msk_fuel_exports_client_getvehiclefuel, docs_msk_fuel_exports_client_setvehiclefuel, docs_msk_fuel_exports_client_getvehiclemaxfuel, docs_msk_fuel_exports_client_setvehiclemaxfuel, docs_msk_fuel_exports_client_getvehiclefueltype, docs_msk_fuel_exports_client_setvehiclefueltype [EXTRACTED 1.00]
- **Config seed to database to dashboard authority flow** — docs_msk_handcuffs_config_settings_lua, docs_msk_handcuffs_database_msk_handcuffs_settings_table, docs_msk_handcuffs_database_seeded_marker, docs_msk_handcuffs_dashboard_admin_dashboard, docs_msk_handcuffs_dashboard_db_is_authoritative [EXTRACTED 1.00]
- **Server-authoritative validation stack** — docs_msk_handcuffs_index_server_authoritative_model, docs_msk_handcuffs_config_config_maxdistance, docs_msk_handcuffs_config_config_restrictitems, docs_msk_handcuffs_statebags_statebags, docs_msk_handcuffs_migration_removed_self_cuff_exports, docs_msk_handcuffs_changelog_v3_0_0_self_uncuff_exploit_fix [EXTRACTED 1.00]
- **Client action export surface used by job-script integrations** — docs_msk_handcuffs_exports_client_cuffplayer, docs_msk_handcuffs_exports_client_hardcuffplayer, docs_msk_handcuffs_exports_client_uncuffplayer, docs_msk_handcuffs_exports_client_dragplayer, docs_msk_handcuffs_exports_client_putplayerincar, docs_msk_handcuffs_exports_client_putplayeroutofcar, docs_msk_handcuffs_guides_general_edits_for_jobs_esx_policejob_integration, docs_msk_handcuffs_guides_jaksam_job_creator_jobs_creator_integration [EXTRACTED 1.00]
- **msk_radio channel password/encryption flow** — docs_msk_radio_exports_client_isencryptedchannel, docs_msk_radio_exports_client_haschannelpassword, docs_msk_radio_exports_client_checkchannelpassword, docs_msk_radio_exports_server_haschannelpassword, docs_msk_radio_exports_server_checkchannelpassword, docs_msk_radio_exports_server_databasejson [EXTRACTED 1.00]
- **msk_vehiclekeys key lifecycle (add, remove, refresh, exchange, transfer)** — docs_msk_vehiclekeys_exports_server_addkey, docs_msk_vehiclekeys_exports_server_removekey, docs_msk_vehiclekeys_exports_server_refreshplayerkeys, docs_msk_vehiclekeys_exports_server_exchangevehiclelocks, docs_msk_vehiclekeys_exports_server_transfervehicle, docs_msk_vehiclekeys_index_key_types [EXTRACTED 1.00]
- **msk_vehiclekeys dashboard governance (permissions, groups, DB tables, live config)** — docs_msk_vehiclekeys_admin_admin_dashboard, docs_msk_vehiclekeys_admin_permission_system, docs_msk_vehiclekeys_admin_permission_keys, docs_msk_vehiclekeys_admin_luxu_admin_support, docs_msk_vehiclekeys_admin_db_tables, docs_msk_vehiclekeys_admin_database_driven_config, docs_msk_vehiclekeys_config_config_split [EXTRACTED 1.00]
- **MSK Forms acceptance flow (status change to applicant DM, role grant, webhooks)** — ecosystem_msk_forms_submissions_and_review_single_status_change_path, ecosystem_msk_forms_discord_bot_notification_outbox, ecosystem_msk_forms_discord_bot_role_grants, ecosystem_msk_forms_integrations_and_api_outgoing_webhooks, ecosystem_msk_forms_index_status_loop, ecosystem_msk_forms_form_builder_automations [EXTRACTED 1.00]
- **MSK Forms custom-domain stack (verification, per-guild OAuth, per-guild captcha, branded hub)** — ecosystem_msk_forms_branding_and_domains_custom_domain, ecosystem_msk_forms_branding_and_domains_per_guild_oauth, ecosystem_msk_forms_branding_and_domains_per_guild_turnstile, ecosystem_msk_forms_branding_and_domains_public_form_hub, ecosystem_msk_forms_privacy_secrets_encrypted_at_rest [EXTRACTED 1.00]
- **Ecosystem privacy principles implemented across tools** — ecosystem_intro_shared_philosophy, ecosystem_msk_paste_privacy_ip_hashing, ecosystem_msk_paste_privacy_burn_after_read, ecosystem_msk_paste_faq_unlisted_pastes, ecosystem_msk_forms_submissions_and_review_applicant_self_service [INFERRED 0.85]
- **MSKanban zero-knowledge key derivation chain** — ecosystem_mskanban_privacy_master_key, ecosystem_mskanban_privacy_auth_hash, ecosystem_mskanban_privacy_workspace_key, ecosystem_mskanban_privacy_board_key, ecosystem_mskanban_privacy_sealed_box_sharing, ecosystem_mskanban_getting_started_recovery_key [EXTRACTED 1.00]
- **Account-less deletion via one-time tokens across MSK web tools** — ecosystem_msk_paste_usage_delete_token, ecosystem_msk_shortener_api_delete_token, ecosystem_msk_shortener_api_delete_api_links_code, ecosystem_msk_shortener_faq_immutable_links [INFERRED 0.85]
- **Shared Debian + Apache + systemd self-hosting pattern** — ecosystem_msk_shortener_installation_install_script, ecosystem_msk_shortener_installation_systemd_service, ecosystem_msk_shortener_installation_apache_reverse_proxy, ecosystem_mskanban_installation_baremetal_deployment, ecosystem_mskanban_installation_apache_wstunnel, ecosystem_mskanban_installation_systemd_hardening [INFERRED 0.85]

## Communities (149 total, 70 thin omitted)

### Community 0 - "MSK Garage Releases & Job Hooks"
Cohesion: 0.05
Nodes (46): msk_fuel server export IsPlayerNearVehicle, Serverside price/amount revalidation with proximity check, msk_garage v4.0.0, msk_garage v4.0.4, msk_garage v5.0.0, msk_garage v5.2.0, Serverside esx:setJob hook cannot be faked by a client, msk_garage:jobVehiclesDeleted hook (+38 more)

### Community 1 - "MSK Core Ace & Commands"
Cohesion: 0.05
Nodes (45): Config.showCoords / Config.copyCoords, MSK.IsAceAllowed (client), MSK.IsPrincipalAceAllowed (client), Server-Side Ace Evaluation via Callback, MSK.RegisterCommand (client), Typed Command Arguments (params), MSK.Coords.Active, MSK.Coords.Copy (+37 more)

### Community 2 - "MSK Core NUI Modules"
Cohesion: 0.05
Nodes (44): MSK.Draw3DText, MSK.DrawGenericText, MSK.Input.Active, MSK.Input.Close, Input Module (MSK.Input), MSK.Input.Open, Sync/Async Dual Call Mode, MSK.Numpad.Active (+36 more)

### Community 3 - "Banking & Core Releases"
Cohesion: 0.06
Nodes (42): exports.msk_banking:addTransaction, exports.msk_banking:getIBANFromIdentifier, Paycheck Transaction (msk_banking ESX integration), Society Payout Flow (esx_society / esx_addonaccount), StartPayCheck, msk_core v3.0.0 Release, msk_core v3.0.1 Release, Shared Registration Guard for Eager-Loaded Modules (+34 more)

### Community 4 - "Ticketbot Dashboard"
Cohesion: 0.07
Nodes (37): Canned Responses (snippets.jsonc), Transcript Design & Language (self-contained HTML), Discord OAuth Dashboard Login, Per-User Dashboard Language, Dashboard-as-Parent-Process Architecture, Dashboard Permission Model, Public End-User Portal, Safe-by-Default Binding (127.0.0.1, HTTPS enforcement) (+29 more)

### Community 5 - "Ecosystem Hosting & APIs"
Cohesion: 0.07
Nodes (31): Shortener and Paste Coexistence (ports 3011 / 3012), Apache2 Reverse Proxy vhost, msk-shortener systemd service (port 3011), MSKanban REST API, OpenAPI 3.1 Spec (docs/api/openapi.yaml), Session Cookie Auth (HttpOnly, SameSite=Strict), Encrypted WebSocket Relay (/api/ws), Attachment Storage Driver (+23 more)

### Community 6 - "CI Security Workflows"
Cohesion: 0.09
Nodes (30): Dependabot Configuration, Grouped Minor/Patch Update PRs, Major Version Bump Ignore Policy, CodeQL Advanced Workflow, security-extended CodeQL Query Suite, Dependency Review Workflow, Permissive License Allowlist, Deploy MSK Scripts Docs Workflow (+22 more)

### Community 7 - "Config & Integration Basics"
Cohesion: 0.07
Nodes (30): Keymaster / Asset Escrow Issues, msk_core Dependency Requirement, MSK Scripts Documentation (Intro), ESX.ShowNotification to MSK Bridge, Notification Override Mechanism, Config.ATMs (models and robbery), MSK Banking config.lua, Config.IBAN (prefix, length, price) (+22 more)

### Community 8 - "Discord Giveaway Bot"
Cohesion: 0.09
Nodes (29): Duration Token Format (1d2h30m), Giveaway Lifecycle (Pause, Resume, End, Cancel, Reroll), Giveaway Slash Command Reference, Reusable Giveaway Templates, Short Public Giveaway ID Code, Giveaway Eligibility Rules (blacklist, whitelist, minaccount, minmember), Per-Guild Configuration via /gsettings, Manager Role Delegation (+21 more)

### Community 9 - "Docusaurus Dependencies"
Cohesion: 0.08
Nodes (25): clsx, @docusaurus/core, @docusaurus/faster, @docusaurus/preset-classic, @easyops-cn/docusaurus-search-local, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/syne (+17 more)

### Community 10 - "MSK Fuel Exports"
Cohesion: 0.13
Nodes (19): msk_fuel client export GetVehicleFuel, msk_fuel client export SetVehicleFuel, msk_fuel server export GetVehicleFuel, msk_fuel server export SetVehicleFuel, msk_core (dependency of msk_fuel), msk_enginetoggle integration, MSK Fuel, StateBag-based fuel state sync (+11 more)

### Community 11 - "CSP Generation Script"
Cohesion: 0.13
Nodes (17): cspDirectives, generated, isExecutableJsType(), JS_MIME_TYPES, OUTPUT_FILE, processHtml(), scriptHashes, scriptHashList (+9 more)

### Community 12 - "VehicleKeys Installation"
Cohesion: 0.12
Nodes (17): Automatic DB creation and one-time JSON migration, Database is authoritative after seeding, msk_vehiclekeys Installation, Load order (oxmysql, ox_lib, msk_core before msk_vehiclekeys), AddPrimaryKey (persistent key), AddTempKey (RAM-only temporary key), Client vs server key exports (anti-exploit ownership gate), HasPlayerKeyOrIsVehicleOwner (+9 more)

### Community 13 - "Context & Menu Modules"
Cohesion: 0.17
Nodes (16): Flat Alias Naming Convention, MSK.Context.GetOpen, MSK.Context.Hide, Context Menu Module (MSK.Context), NUI Mouse Focus Trade-off, MSK.Context.Register, MSK.Context.Show, MSK.Context.Update (+8 more)

### Community 14 - "Handcuffs Status Restore"
Cohesion: 0.17
Nodes (15): Idempotent database.json migration, msk_handcuffs status table, msk_handcuffs:handler integration event, msk_handcuffs:requestRestore, ankleTrackerPlayer client export, headbagPlayer client export, Multichar status restore workaround, AnkleTracker feature (+7 more)

### Community 15 - "Handcuffs Admin & Config"
Cohesion: 0.18
Nodes (14): Escort TextUI hint with bound key, QBCore support via msk_core auto-detection, msk_handcuffs v3.0.0 release, /handcuffadmin dashboard command, Config.LuxuAdmin, Config.Props (attached prop hashes), Two-file config split, config/static.lua (+6 more)

### Community 16 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): cheerio, @docusaurus/module-type-aliases, @docusaurus/tsconfig, @docusaurus/types, devDependencies, cheerio, @docusaurus/module-type-aliases, @docusaurus/tsconfig (+5 more)

### Community 17 - "Callback System & Shared Modules"
Cohesion: 0.21
Nodes (13): Callbacks do not cross the network, MSK.Context.Show (server), MSK.Input.Open (server), Client-side Input Value Normalization, MSK.Menu.Show (server), MSK.Numpad.Open (server), MSK Callback System, Framework-agnostic Shared Modules (+5 more)

### Community 18 - "Yarn Resolutions"
Cohesion: 0.15
Nodes (13): resolutions, @babel/core, @babel/plugin-transform-modules-systemjs, fast-uri, follow-redirects, http-proxy-middleware, postcss, qs (+5 more)

### Community 19 - "MSK Simcard Config"
Cohesion: 0.23
Nodes (12): msk_simcard Config, Config.DiscordLog (msk_simcard), Config.numberFormat (number / gc / canada), Config.StartingDigit, Compatible phone resources (msk_simcard), MSK Simcard, simcard item (random number), simcard_wish item (chosen number) (+4 more)

### Community 20 - "MSK Forms Builder & Bot"
Cohesion: 0.20
Nodes (12): MSK Forms Discord Bot, Discord review workflow (review channel, Accept/Reject buttons), Automatic accepted-role grants, MSK Forms FAQ, Automations (when-then rules, Pro), Calculated fields (server-side formula evaluation), Conditional logic (show/hide/require/skip-to), MSK Forms Form Builder (+4 more)

### Community 21 - "VehicleKeys Admin Dashboard"
Cohesion: 0.22
Nodes (11): msk_vehiclekeys Admin Dashboard, Database-authoritative config (seed once from config), msk_vehiclekeys DB tables (settings/permissions/locksmiths), luxu_admin staff-group resolution, Dashboard permission keys (keys/vehicles/locksmith/lists/settings/permissions), ACE-based dashboard permission system, msk_vehiclekeys v3.0.0, msk_vehiclekeys v3.1.0 (+3 more)

### Community 22 - "VehicleKeys Key Exports"
Cohesion: 0.24
Nodes (11): Garage/shop key hand-out regression fix, msk_vehiclekeys v3.1.1, msk_vehiclekeys AddKey (client export), Client-path ownership/proximity security check, msk_vehiclekeys RemoveKey (client export), msk_vehiclekeys TransferVehicle (client export), msk_vehiclekeys AddKey (server export), playerData {source|identifier} / vehicleData {plate,model|netId} contract (+3 more)

### Community 23 - "MSK Ecosystem Stacks"
Cohesion: 0.22
Nodes (11): MSK Ecosystem, Shared ecosystem tech stack (Next.js 15, TypeScript, MariaDB, Tailwind, Zod, next-intl), MSK Forms tech stack (Next.js 16, PostgreSQL/Prisma, Redis, MinIO, discord.js), MSK Paste FAQ & Troubleshooting, Pastes are immutable, MSK Paste, MSK Paste tech stack (Next.js 15, MariaDB, Shiki, bcryptjs), Apache2 reverse proxy + systemd service on port 3012 (+3 more)

### Community 24 - "MSK Forms Integrations & API"
Cohesion: 0.18
Nodes (11): Guild activity log channel, Guild-wide bot language, Notification outbox (transactional record, 15s bot poll, retry), One active submission per person, The status loop (live applicant feedback on a private link), API keys (mskf_ prefix, hash-only storage, guild scoped), MSK Forms Integrations & API, Outgoing webhooks (HMAC-SHA256 signed, generic JSON or Discord format) (+3 more)

### Community 25 - "npm Scripts"
Cohesion: 0.18
Nodes (11): scripts, build, clear, deploy, docusaurus, serve, start, swizzle (+3 more)

### Community 26 - "Handcuffs Commands & Exports"
Cohesion: 0.24
Nodes (10): Player chat commands (/cuff, /uncuff, ...), Config.RestrictItems, msk_handcuffs:requestDrag, msk_handcuffs:useItem, cuffPlayer client export, dragPlayer / escortPlayer client export, getIsHandcuffed client export, hardcuffPlayer client export (+2 more)

### Community 27 - "Handcuffs Settings & Items"
Cohesion: 0.24
Nodes (10): Config.ItemSettings, Config.Target (ox_target / qb-target integration), Config.Theme (MSK UI colours), config/settings.lua, msk_handcuffs_settings table, __seeded__ marker row, uncuffPlayer client export, msk_handcuffs inventory item definitions (+2 more)

### Community 28 - "VehicleKeys NUI & Locksmith"
Cohesion: 0.22
Nodes (10): Own NUI keys/locksmith menu (nui default), msk_vehiclekeys v3.2.0, Language dropdown built from translation.lua, msk_context / msk_menu support (msk_core v3), msk_vehiclekeys v3.3.0, Config.Locksmith, msk_vehiclekeys ExchangeVehicleLocks (client export), msk_vehiclekeys openKeysMenu (client export) (+2 more)

### Community 29 - "MSK Paste REST API"
Cohesion: 0.25
Nodes (9): Shared privacy philosophy (no accounts, no trackers, hashed IPs, hard-deletes), Delete token (only way to remove a paste), Shared error envelope + status code table, No API authentication (public endpoints, rate limit + delete token instead), Create-endpoint rate limiting (10/hour per IP hash), MSK Paste REST API, MSK Paste environment variables (IP_HASH_SECRET, DB_*, limits), Burn-after-read (atomic DELETE in the read round-trip) (+1 more)

### Community 30 - "MSK Shortener REST API"
Cohesion: 0.22
Nodes (9): API Error Envelope, GET /api/links/:code, GET /api/stats, GET /api/links/:code/qr, POST /api/verify, MSK Shortener REST API, bcrypt cost 12 Link Passwords, Generic 401 Anti-Enumeration Response (+1 more)

### Community 31 - "Browserslist Targets"
Cohesion: 0.22
Nodes (9): browserslist, development, production, >0.5%, last 3 chrome version, last 3 firefox version, last 5 safari version, not dead (+1 more)

### Community 32 - "EngineToggle Integrations"
Cohesion: 0.29
Nodes (8): msk_enginetoggle:enteringVehicle (client), msk_enginetoggle:enteringVehicle (server), exports.msk_enginetoggle:SetVehicleDamaged, qb-vehiclefailure Integration, RealisticVehicleFailure Integration, Config.VehicleKeys, msk_core (dependency), MSK EngineToggle

### Community 33 - "Garage Job Vehicle Config"
Cohesion: 0.25
Nodes (8): Config.deleteJobVehiclesOnJobChange, Config.useSocietyName, esx:setJob server event hook, Faction filter in the garage list, Job vehicle ownership (player vs society), Keys.RemoveAllKeys adapter call, msk_garage:jobVehiclesDeleted, Vehicle key adapter contract

### Community 34 - "Handcuffs Server Exports"
Cohesion: 0.25
Nodes (8): Admin chat commands (/adcuff, ...), gethasPlayerAnkleTracker server export, gethasPlayerHeadbag server export, gethasPlayerTape server export, getIsPlayerHandcuffed server export, getIsPlayerHardcuffed server export, Player selector table (source/identifier/player), Removed admin exports

### Community 35 - "MSK Paste Web Features"
Cohesion: 0.25
Nodes (8): Burn After Read, Custom Paste ID, Nightly Paste Cleanup Job (03:30), MSK Paste (web interface), Paste Password Gate, Raw and Download Routes, Shortener Cron Jobs (backup 03:00, cleanup 03:30), backup.sh (14-day retention)

### Community 36 - "Shortener SSRF & Stack"
Cohesion: 0.25
Nodes (8): No OG-Tag Link Previews, http/https Scheme Whitelist, MSK Shortener, MSK Shortener Tech Stack (Next.js 15, MariaDB, Zod, next-intl), Shortener SSRF Protection, MSKanban, MSKanban Tech Stack (Next.js 16, Prisma 7, Redis, libsodium), MSK Scripts Guides Landing Page

### Community 38 - "Entity Proximity Helpers"
Cohesion: 0.29
Nodes (7): MSK.GetClosestEntities (Entities module), MSK.GetClosestEntity (Entities module), MSK.GetClosestPlayer, MSK.GetClosestPlayers, MSK.IsSpawnPointClear, Config.MaxFuelingDistance (anti-exploit), Config.Petrolcan

### Community 39 - "Callback & Timeout Primitives"
Cohesion: 0.33
Nodes (7): Blocking Promise with 5s Timeout, MSK.Register, MSK.Trigger, MSK.TriggerCallback, MSK.Call, MSK.Timeout.Await, ox_lib WaitFor (inspiration)

### Community 40 - "Radio Channels & Voice"
Cohesion: 0.29
Nodes (7): tapePlayer client export, Tape feature, Config.EncryptedChannels (job-restricted radio channels), Config.VoiceSystem (pma / saltychat / tokovoip), msk_radio:closeRadio, msk_radio:openRadio, MSK Radio

### Community 41 - "VehicleKeys Refresh & Config"
Cohesion: 0.38
Nodes (7): Refresh vs Refresh FORCE, msk_vehiclekeys Commands & Keybinds, msk_vehiclekeys Config, Config.GivePrimaryKey strategies, Config.OnRefreshKeys, msk_vehiclekeys RefreshPlayerKeys (client export), msk_vehiclekeys RefreshPlayerKeys (server export)

### Community 42 - "VehicleKeys Key Types"
Cohesion: 0.33
Nodes (7): Config.Settings.key.ownerNeedsItem, Config.VehicleTarget (ox_target), msk_vehiclekeys toggleLock (client export), Primary / Secondary / Temporary key types, Keyring system (second inventory), MSK VehicleKeys, Metadata-based unique key items

### Community 43 - "Delete Token Pattern"
Cohesion: 0.29
Nodes (7): Paste Delete Token, DELETE /api/links/:code, Shortener Delete Token, mskshort() Bash helper, POST /api/links, Immutable Short Links, Short Code Generation (nanoid, 7 chars)

### Community 44 - "Rate Limiting & Webhooks"
Cohesion: 0.29
Nodes (7): Paste Create Rate Limit (10/h per IP hash), Keyless Public API (no API key), Shortener Rate Limiting (20/h create, 10/5min verify), MSKanban Rate Limits, X-MSKanban-Signature HMAC Verification, MSKanban Webhooks (HMAC-signed, DLQ), Redis Hard Requirement

### Community 45 - "IP Hashing & Statistics"
Cohesion: 0.29
Nodes (7): Paste Statistics Page, Anonymized Per-Click Tracking, MSK Shortener Environment Variables, MSK Shortener install.sh, IP_HASH_SECRET, HMAC-SHA-256 IP Hashing, Pino Structured Logging (hashed IPs)

### Community 46 - "Entity Lookup Helpers"
Cohesion: 0.33
Nodes (6): MSK.GetClosestEntities, MSK.GetClosestVehicles, MSK.GetVehicleWithPlate, MSK.GetClosestPlayers, MSK.IsSpawnPointClear, MSK.GetClosestVehicleWithPlate

### Community 47 - "Radio Channel Passwords"
Cohesion: 0.40
Nodes (6): msk_radio checkChannelPassword (client export), msk_radio hasChannelPassword (client export), msk_radio checkChannelPassword (server export), database.json channel-password store (msk_radio), msk_radio getDatabase (server export), msk_radio hasChannelPassword (server export)

### Community 48 - "VehicleKeys Admin Vehicles"
Cohesion: 0.33
Nodes (6): Config.AdminCommand (/adlock), Whitelist / Blacklist / AdminVehicles / JobVehicles, msk_vehiclekeys toggleLockAdmin (client export), msk_vehiclekeys GetOwnedVehiclesInRadius (server export), msk_vehiclekeys IsAdminVehicleAllowed (server export), msk_vehiclekeys IsJobVehicle (server export)

### Community 49 - "Forms Custom Domains"
Cohesion: 0.40
Nodes (6): MSK Forms Branding & Custom Domains, Custom domain (CNAME + TXT verification, automatic TLS), Per-guild Discord OAuth app on a custom domain, Per-guild Turnstile captcha key, Webhook posting identity (shared multi-tenant bot workaround), Per-guild integration secrets encrypted at rest (AES-256-GCM)

### Community 50 - "Privacy & CSP Hardening"
Cohesion: 0.33
Nodes (6): Custom CSS sanitizing on save and render (defense in depth), Nonce-based CSP with strict-dynamic, Not zero-knowledge by design (reviewers must read answers), Paste password protection (bcrypt cost 12, content not encrypted at rest), MSK Paste Privacy & Security, MSK Paste CSP and security headers

### Community 51 - "Forms Upload & GDPR"
Cohesion: 0.33
Nodes (6): Logo upload hardening (magic-byte check, WebP re-encode), Submission link as capability token, MSK Forms Privacy & Security, Server-proxied file uploads to private MinIO storage, Applicant self-service (GDPR withdraw / export / delete), Unlisted-only pastes (no search, no directory)

### Community 52 - "Forms Plans & Teams"
Cohesion: 0.33
Nodes (6): A/B testing (sticky variant assignment), MSK Forms Getting Started, Guild linking on bot join (owner becomes MSK Forms owner), MSK Forms Plans & Limits, Submission exports (CSV / XLSX / JSON / PDF), Team & access roles (Owner/Admin, Reviewer, Viewer, per-form grants)

### Community 53 - "MSKanban Deployment & 2FA"
Cohesion: 0.33
Nodes (6): TOTP and WebAuthn 2FA Setup, MSKanban Bare-Metal Deployment, MSKanban Docker Deployment, MSKanban Environment Variables, systemd Hardening Profile, WEBAUTHN_RP_ID

### Community 54 - "package.json Metadata"
Cohesion: 0.33
Nodes (5): engines, node, name, private, version

### Community 55 - "Server UI Wrappers"
Cohesion: 0.40
Nodes (5): Fire-and-forget Server UI Wrapper, MSK.Progress.Start (server), MSK.TextUI.Show (server), MSK.TextUI.ShowThread (server), Config.Notification (msk_fuel)

### Community 56 - "Version Checker"
Cohesion: 0.50
Nodes (5): Config.VersionChecker, MSK.Check (Version Checker namespace), MSK.Check.Dependency, MSK.Check.Version, x.x.x Version Format Convention

### Community 57 - "Fuel Commands & Config"
Cohesion: 0.40
Nodes (5): /repairVehicle Command, /setFuel Command, Config.Commands (msk_fuel), Config.Vehicles Fuel Types, Config.WrongFuel

### Community 58 - "Fuel Types & Engine Failure"
Cohesion: 0.40
Nodes (5): msk_fuel client export SetEngineFailure, msk_fuel client export SetEngineRepaired, msk_fuel client export SetVehicleFuelType, Fuel types (gas, diesel, kerosin, electric), Wrong fuel causes progressive engine failure

### Community 59 - "Garage AdvancedParking"
Cohesion: 0.40
Nodes (5): msk_garage v4.0.2, msk_garage v5.3.0, Config.UsesAdvancedParking auto-detection, AdvancedParking integration, AdvancedParking impound lock

### Community 60 - "Garage Job Garages & Theme"
Cohesion: 0.40
Nodes (5): msk_garage v5.1.0, Jobs block (per-rank access), Colors & branding theming, Job Garages tab (whitelist/blacklist), Per-model vehicle images

### Community 61 - "Radio Channel Exports"
Cohesion: 0.40
Nodes (5): msk_radio getRadioChannel (client export), msk_radio removeRadioChannel (client export), msk_radio setRadioChannel (client export), tokovoip voice integration (msk_radio), msk_radio getChannelMembers (server export)

### Community 62 - "VehicleKeys Storage Migration"
Cohesion: 0.40
Nodes (5): vehiclekeys.json backup & safe-load recovery, msk_vehiclekeys v1.3.8, msk_vehiclekeys v1.3.9, JSON to MariaDB storage migration, msk_vehiclekeys v2.0.0

### Community 63 - "Shortener Links & Clicks"
Cohesion: 0.40
Nodes (5): GET /api/links/:code/stats, clicks Table Schema, links Table Schema, Per-Link Click Statistics Page, Short Link Redirect Flow

### Community 64 - "MSKanban Board Views"
Cohesion: 0.50
Nodes (5): WCAG 2.1 AA Accessibility, Client-Side Analytics Charts, Five Board Views (Board/Calendar/Timeline/Table/Analytics), Milestones, Offline-First PWA (IndexedDB snapshots)

### Community 65 - "Banking Client Callbacks"
Cohesion: 0.50
Nodes (4): msk_banking client export getBankingInfo, msk_banking:getMainAccount callback, msk_banking:getSecondAccount callback, msk_banking:hasBankcard callback

### Community 66 - "MSK Ban System"
Cohesion: 0.50
Nodes (4): MSK.BanPlayer, MSK.IsPlayerBanned, msk_bansystem Database Table, MSK.UnbanPlayer

### Community 67 - "MSK Table Helpers"
Cohesion: 0.50
Nodes (4): MSK.Table.Contains, MSK.Table.Find, MSK.Table.Index, MSK.Table.LastIndex

### Community 68 - "Handcuffs Trust Model"
Cohesion: 0.50
Nodes (4): Server-driven timer and uncuff-on-death (exploit fix), Config.MaxDistance, Server-authoritative trust model, Removed self-cuff exports (Cuff/Hardcuff/Uncuff)

### Community 69 - "Release Body Generation (Commits"
Cohesion: 0.67
Nodes (3): Auto Release Workflow, Release Body Generation (Commits + Modified Files), Tag Resolution and Optional Tag Creation

### Community 70 - "Inline Schema Migrations on"
Cohesion: 0.67
Nodes (3): User DM Notifications, Inline Schema Migrations on Start, Ticket Bot Database Schema

### Community 71 - "msk_banking:setSharedAccountMoney event handler"
Cohesion: 0.67
Nodes (3): msk_banking:getSharedAccount event, msk_banking:setSharedAccountMoney event handler, msk_banking server export getAccount

### Community 72 - "MSK.GetRegisteredItems"
Cohesion: 0.67
Nodes (3): MSK.GetRegisteredItem, MSK.GetRegisteredItems, MSK.RegisterItem

### Community 73 - "Atomic SQL Deduction Guard"
Cohesion: 0.67
Nodes (3): Atomic SQL Deduction Guard, MSK.Offline.RemoveBank, MSK.Society.RemoveMoney

### Community 74 - "exports.msk_core:GetLib"
Cohesion: 0.67
Nodes (3): exports.msk_core:GetLib, MSK.GetConfig, MSK.Logging

### Community 75 - "Inverted Trim Boolean Semantic"
Cohesion: 0.67
Nodes (3): Inverted Trim Boolean Semantic (v2 legacy), MSK.String.Trim, String.TrimLegacy (MSK.Trim alias)

### Community 76 - "Config.showKeyOwnerName"
Cohesion: 0.67
Nodes (3): Config.showKeyOwnerName, Second-key badge, Utils.GetOwnerName

### Community 77 - "msk_radio isRadioOpen (client export)"
Cohesion: 0.67
Nodes (3): msk_radio closeRadio (client export), msk_radio isRadioOpen (client export), msk_radio openRadio (client export)

### Community 78 - "msk_vehiclekeys RemoveAllExistingKeys (server export)"
Cohesion: 0.67
Nodes (3): msk_vehiclekeys v1.3.7, msk_vehiclekeys ChangeNumberPlate (server export), msk_vehiclekeys RemoveAllExistingKeys (server export)

## Ambiguous Edges - Review These
- `MSK Shortener` → `MSK Scripts Guides Landing Page`  [AMBIGUOUS]
  guides/intro.md · relation: conceptually_related_to

## Knowledge Gaps
- **373 isolated node(s):** `config`, `name`, `version`, `private`, `docusaurus` (+368 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **70 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `MSK Shortener` and `MSK Scripts Guides Landing Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Server Functions Overview` connect `MSK Core NUI Modules` to `MSK Core Ace & Commands`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `msk_core Client Functions Overview` connect `MSK Core Ace & Commands` to `Banking & Core Releases`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `MSK.Player[source] Mirrored Table` connect `MSK Core Ace & Commands` to `MSK Core NUI Modules`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _373 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MSK Garage Releases & Job Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.05314009661835749 - nodes in this community are weakly interconnected._
- **Should `MSK Core Ace & Commands` be split into smaller, more focused modules?**
  _Cohesion score 0.052525252525252523 - nodes in this community are weakly interconnected._
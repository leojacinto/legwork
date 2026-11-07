import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'aiux-color-swatch|legwork': {
                        table: 'sys_aix_color_swatch'
                        id: 'a02c9d3e7d485e3f0a956732ab50548e'
                    }
                    'aiux-dependency|pose.js': {
                        table: 'sys_aix_dependency'
                        id: '32fb0ee7ba9021325316fd168e538f89'
                    }
                    'aiux-experience-page-rel|x-snc-legwork-home-page': {
                        table: 'sys_aix_experience_page_rel'
                        id: '9f017744958438e0578d7a1ce5a07456'
                    }
                    'aiux-experience-prop|appHeadCss': {
                        table: 'sys_aix_experience_properties'
                        id: '54b455e8277523aea711ebee26b94f4c'
                    }
                    'aiux-experience-prop|appTailwindCss': {
                        table: 'sys_aix_experience_properties'
                        id: 'c849186c8efbc3b4227b35eb8969ea0d'
                    }
                    'aiux-experience|legwork': {
                        table: 'sys_aix_experience'
                        id: '703e33f734ed92f5e3ab381a2b0cb39e'
                    }
                    'aiux-layout-widget|lifecycle': {
                        table: 'sys_aix_widget'
                        id: '347c3b1db7c09bd4355feb85ad05d294'
                    }
                    'aiux-m2m-widget-dep|x-snc-legwork-home-page|pose.js': {
                        table: 'sys_aix_m2m_widget_dependency'
                        id: 'd90948a4d0a5be2852b240d7d27239e4'
                    }
                    'aiux-page-widget|x-snc-legwork-home-page': {
                        table: 'sys_aix_widget'
                        id: 'f069d6f9d344d41c5cb5bf4e8a1a47ba'
                    }
                    'aiux-page|x-snc-legwork-home-page': {
                        table: 'sys_aix_page'
                        id: 'faa1cbf86261b068945ce0066c51193a'
                    }
                    'aiux-project|x_snc_legwork': {
                        table: 'sys_aix_project'
                        id: 'd29b971b8d0bd46e4cef0b9e8d5c2b5f'
                    }
                    'aiux-theme|legwork': {
                        table: 'sys_aix_theme'
                        id: '9828b389e03af5fc45d8e1cf0bac62c1'
                    }
                    'aiux-widget|aiux-hello-world': {
                        table: 'sys_aix_widget'
                        id: '4bc13dad39a656994b6ee264e217f041'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '152eaa6ffaa442dbabec2b53231abecf'
                    }
                    legwork_close_reviewer: {
                        table: 'sn_aia_agent'
                        id: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                    }
                    legwork_close_reviewer_acl: {
                        table: 'sys_security_acl'
                        id: '7f1eb21c04d84800bddb3c4e9e5c0829'
                    }
                    legwork_close_reviewer_member: {
                        table: 'sn_aia_agent'
                        id: '6e3b9a67383d4790b2dbcb9157e319a0'
                        deleted: true
                    }
                    legwork_created_create: {
                        table: 'sys_security_acl'
                        id: '5fe4db7e17c9466d8895e950965a82d4'
                    }
                    legwork_created_delete: {
                        table: 'sys_security_acl'
                        id: 'ea342c7f81184a8ea27da4cc61b2d2f9'
                    }
                    legwork_created_read: {
                        table: 'sys_security_acl'
                        id: 'f90099058ff04e4c8c04a162f9800819'
                    }
                    legwork_created_write: {
                        table: 'sys_security_acl'
                        id: 'ab7fc869c6a1442b883b495f6b3d122b'
                    }
                    legwork_drill_coach: {
                        table: 'sn_aia_agent'
                        id: '922ecd6b69144afab8eb2d851989b81a'
                    }
                    legwork_drill_coach_acl: {
                        table: 'sys_security_acl'
                        id: '3a3468f262584b7aac46f5e94b48d772'
                    }
                    legwork_drill_coach_member: {
                        table: 'sn_aia_agent'
                        id: 'e50f62e7b4eb484ca8af2b1768913274'
                        deleted: true
                    }
                    legwork_form_assessor: {
                        table: 'sn_aia_agent'
                        id: 'c24a14b64a3c4571b8d846f0f65ee49f'
                    }
                    legwork_form_assessor_acl: {
                        table: 'sys_security_acl'
                        id: '7f0cff3ff13047f5ad01be7f999e8fba'
                    }
                    legwork_form_assessor_member: {
                        table: 'sn_aia_agent'
                        id: 'd4252b085c0d48799fed6b01612e0f6e'
                        deleted: true
                    }
                    legwork_form_loop: {
                        table: 'sn_aia_usecase'
                        id: '1ae2ccb9a20e4706a769942ea16b63c4'
                    }
                    legwork_form_loop_acl: {
                        table: 'sys_security_acl'
                        id: '56c613cb333440d99ac05ab895586c74'
                    }
                    legwork_run_create: {
                        table: 'sys_security_acl'
                        id: '6097393b6418457f81cc89db2810300f'
                    }
                    legwork_run_delete: {
                        table: 'sys_security_acl'
                        id: '5616ff08b9b64d21af579ee0f20db59b'
                    }
                    legwork_run_read: {
                        table: 'sys_security_acl'
                        id: '6e3905b5c0c648eab5a219c4502bb68a'
                    }
                    legwork_run_write: {
                        table: 'sys_security_acl'
                        id: '75110acdad5241fa817ca39618962fba'
                    }
                    'legwork-api': {
                        table: 'sys_ws_definition'
                        id: '1c8f1f2d4bc64c9794f43acd2d7eb018'
                    }
                    'legwork-clear': {
                        table: 'sys_ws_operation'
                        id: 'c856f1ffaa9f4e6e9421b58951194dba'
                    }
                    'legwork-ops': {
                        table: 'sys_script_include'
                        id: '81e927a704784879ac5cb2e5519ece36'
                    }
                    'legwork-run-create': {
                        table: 'sys_ws_operation'
                        id: 'ad5b773a72a44d3cbbe38e6f006d226c'
                    }
                    'legwork-run-get': {
                        table: 'sys_ws_operation'
                        id: '1452cce2d7cc49b09c0130569c55d3da'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'f5f43cbb4a894a8c98f57c7cd971b3ab'
                    }
                    src_server_LegworkOps_server_js: {
                        table: 'sys_module'
                        id: 'dacffb1ebd284a6593962f009f13d100'
                    }
                    'typesafe-api-key': {
                        table: 'sys_properties'
                        id: 'b82691740e65477c9039d64febe23947'
                    }
                }
                composite: [
                    {
                        table: 'sys_dictionary'
                        id: '0199bc47cbbf4dc39339cf6880892eef'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'breaches'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: '023e00d70c93472dbc215005eeebd859'
                        key: {
                            agent: 'c24a14b64a3c4571b8d846f0f65ee49f'
                            tool: '78d788435197424c9616f9740b32cd55'
                            name: 'Assess Run'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '03075725a2d9412aa6e1c03586d28302'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'runner'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '05f5bf45d9584406a71fc6779c473bc2'
                        key: {
                            name: 'Assign Drills'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '08335bbfa4ed4c44973016ee3230a49b'
                        key: {
                            agent_access_config: {
                                id: 'c95ad3c6140247a5955640ab99a722f7'
                                key: {
                                    agent: 'c24a14b64a3c4571b8d846f0f65ee49f'
                                }
                            }
                            role: {
                                id: '8e52f1521fa24727923fb0272e0cf846'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b817a5435d748c78ba1e8eccb1dfd3e'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'step_count'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0c18c522b8bf41a2a1af497334f17216'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'verdict'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '0e10fe9602454be8883267d010394c20'
                        key: {
                            name: 'x_snc_legwork_run'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0e15abfa8c2d45fc870b2e6a99f66ea9'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'clip'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '10195474198e457c94ce14e9be856ba7'
                        key: {
                            agent_access_config: {
                                id: 'c81d8f733e3c497cbea2ab7cf18c810c'
                                key: {
                                    agent: '922ecd6b69144afab8eb2d851989b81a'
                                }
                            }
                            role: {
                                id: 'd74b4148d08043698ad42a2521c5b716'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1020d3f3a3cd4089b0b6e2c3d46a2edf'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'label'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '1080db22dbec41a095752b2f1b1a6566'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '10d593172a13493a90617693f8878e88'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'clip'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1141c801d4d4419c832611984c744ae9'
                        key: {
                            sys_security_acl: '6e3905b5c0c648eab5a219c4502bb68a'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '132227416b6f4ef496784afb2bbd0ab9'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'target_table'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '18f70e0f089447d78007932558836869'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'jev_probability'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19b00c63eda3481087ac3690ad4feb6b'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'cadence'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1b7d0e050cf74c4699d264e9f0a2a9a4'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'push'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1eca4653b2284aafba9b6e6fb86a90f2'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'push'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_aia_agent_config'
                        id: '1ef7543f92424cedba5c907a2375cdf6'
                        key: {
                            agent: '922ecd6b69144afab8eb2d851989b81a'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: '29bffb36bcdc4a6b88b2a55f21672fe0'
                        key: {
                            agent: '922ecd6b69144afab8eb2d851989b81a'
                            tool: '05f5bf45d9584406a71fc6779c473bc2'
                            name: 'Assign Drills'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '29faadd945fe4b619c37a2786be7e383'
                        key: {
                            sys_security_acl: 'ea342c7f81184a8ea27da4cc61b2d2f9'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_aia_team_member'
                        id: '2a766f30e658483c97fc51e4eb92b19a'
                        key: {
                            agent: 'c24a14b64a3c4571b8d846f0f65ee49f'
                            team: {
                                id: '382cfc322bcf438682d25907afd9a00a'
                                key: {
                                    name: 'Legwork Form Team'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: '2e70e2439fd24ea986c234b1017b5905'
                        key: {
                            agent: '1ae2ccb9a20e4706a769942ea16b63c4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2fb5841e7751418db6ed885e565aaab6'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'breaches'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_aia_team_member'
                        id: '3019eac256a04f5fb0ed0cd8670ea982'
                        deleted: true
                        key: {
                            agent: '6e3b9a67383d4790b2dbcb9157e319a0'
                            team: {
                                id: '382cfc322bcf438682d25907afd9a00a'
                                key: {
                                    name: 'Legwork Form Team'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '30993923eb764dd492dc199f31cdfa63'
                        key: {
                            agent_access_config: {
                                id: 'c95ad3c6140247a5955640ab99a722f7'
                                key: {
                                    agent: 'c24a14b64a3c4571b8d846f0f65ee49f'
                                }
                            }
                            role: {
                                id: '3661e321e9114edb800a06fdccd1531f'
                                key: {
                                    name: 'sn_hs_rm.risk_assessment_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3216324da934487cb2666309f65e98ba'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'jev_probability'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '3246851c621b4e31a3da461abb890494'
                        key: {
                            name: 'x_snc_legwork_created'
                        }
                    },
                    {
                        table: 'sn_aia_agent_tool_m2m'
                        id: '344794645e3f41b5af8aaa79a49855fe'
                        key: {
                            agent: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                            tool: '71000b4b66b344d8b4e4911739d148c5'
                            name: 'Close Check'
                        }
                    },
                    {
                        table: 'sn_aia_team'
                        id: '382cfc322bcf438682d25907afd9a00a'
                        key: {
                            name: 'Legwork Form Team'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '4052edf86e4947ea81448a10f237e99e'
                        key: {
                            agent_access_config: {
                                id: 'c81d8f733e3c497cbea2ab7cf18c810c'
                                key: {
                                    agent: '922ecd6b69144afab8eb2d851989b81a'
                                }
                            }
                            role: {
                                id: 'b2b30e1f97764d6a8062be683fcb626f'
                                key: {
                                    name: 'sn_ohs_im.action_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4192af67247e4e7682ac380569818138'
                        deleted: true
                        key: {
                            sys_security_acl: '56c613cb333440d99ac05ab895586c74'
                            sys_user_role: '2831a114c611228501d4ea6c309d626d'
                        }
                    },
                    {
                        table: 'sn_aia_usecase_config_override'
                        id: '41a1cf77cbee49d3b128ff6ded3a72f0'
                        key: {
                            usecase_configuration: '1ae2ccb9a20e4706a769942ea16b63c4'
                        }
                    },
                    {
                        table: 'sn_aia_version'
                        id: '4525df40b711450498e1820eeb581644'
                        key: {
                            target_id: '1ae2ccb9a20e4706a769942ea16b63c4'
                            version_name: 'V1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '465c227d33e04347847f459aa0cc5fc3'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'run'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '488b95a2470f45da8e77a68d035b06b5'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '48c8e28fd4c34c3f893830a3ba282ebd'
                        key: {
                            name: 'aiux-source d29b971b8d0bd46e4cef0b9e8d5c2b5f'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4a7dc4d29d8548608a91237dbeea170c'
                        key: {
                            sys_security_acl: '75110acdad5241fa817ca39618962fba'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '4a92965f932a4f498a5c11eb96e9189e'
                        key: {
                            agent_access_config: {
                                id: '2e70e2439fd24ea986c234b1017b5905'
                                key: {
                                    agent: '1ae2ccb9a20e4706a769942ea16b63c4'
                                }
                            }
                            role: {
                                id: 'dcde2c9a4f9d4050a9fbe07203e31136'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4e4f00296e504f76a2be5a4b2e4239a6'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'dry_run'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '50ea3d2a68c14146808d0765e4987951'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'label'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '59a35e885beb452f957b597526004b08'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'cadence'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5b0bbde5ed83495dbef281cfb9ae588e'
                        key: {
                            sys_security_acl: '6097393b6418457f81cc89db2810300f'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5bd53c5be0804acdb04b9c6ddd9cc50e'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'target_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5d6ce8d25bff45689135e3164ba3d4a4'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'overstride'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5e9cfaafd31d44c3987d303217477aed'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'agent_log'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '607389d55abf445da3f4d2585e61e124'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sn_aia_team_member'
                        id: '61af1177db8b4ab1adba3c1253d58d4f'
                        key: {
                            agent: '922ecd6b69144afab8eb2d851989b81a'
                            team: {
                                id: '382cfc322bcf438682d25907afd9a00a'
                                key: {
                                    name: 'Legwork Form Team'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '64880ebc7f7e42ae98d47c70f90608bf'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'trunk_lean'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '660e9c39860a48f48bbaee88d6c039fb'
                        deleted: true
                        key: {
                            sys_security_acl: '7f1eb21c04d84800bddb3c4e9e5c0829'
                            sys_user_role: '2831a114c611228501d4ea6c309d626d'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '67c485f1a9a94cdb8504d1fb8b2e498f'
                        key: {
                            sys_security_acl: '5616ff08b9b64d21af579ee0f20db59b'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '6b77a69d426240af8a9d302181f60005'
                        key: {
                            agent_access_config: {
                                id: 'c95ad3c6140247a5955640ab99a722f7'
                                key: {
                                    agent: 'c24a14b64a3c4571b8d846f0f65ee49f'
                                }
                            }
                            role: {
                                id: '96eaa433a62a4287aae1ba72f293b7ef'
                                key: {
                                    name: 'sn_ohs_im.action_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_aia_team_member'
                        id: '6d0bd673e1c94586a3c95c56a5f636de'
                        deleted: true
                        key: {
                            agent: 'd4252b085c0d48799fed6b01612e0f6e'
                            team: {
                                id: '382cfc322bcf438682d25907afd9a00a'
                                key: {
                                    name: 'Legwork Form Team'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '6dd259a543744e628b7e0c30ff60c637'
                        key: {
                            agent_access_config: {
                                id: 'cf622258c7b9431a95fb4618f18d3340'
                                key: {
                                    agent: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                                }
                            }
                            role: {
                                id: 'ffd4e8ed4df04ece8b31c059d0a5491a'
                                key: {
                                    name: 'sn_hs_rm.risk_assessment_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6e3e28b349314b259ce9ce0387b3af27'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'label'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '70b5546e6c8c4d6086266e8d28a6de1c'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'state'
                            value: 'assessed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '71000b4b66b344d8b4e4911739d148c5'
                        key: {
                            name: 'Close Check'
                        }
                    },
                    {
                        table: 'sn_aia_agent_config'
                        id: '71e6a857544f491dbbcecb4d2571c0cf'
                        key: {
                            agent: 'c24a14b64a3c4571b8d846f0f65ee49f'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '74a6bb48f7934a7cb39b19cb1299b29d'
                        key: {
                            sys_security_acl: 'ab7fc869c6a1442b883b495f6b3d122b'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '74f0e4f7f77b4c089a69fb8345d951ca'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'drills'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7547aaf80d7a4774a33054876f74f6f6'
                        key: {
                            sys_security_acl: '5fe4db7e17c9466d8895e950965a82d4'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '75c6a886ebc749408a04f1f5d8e60923'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'trunk_lean'
                        }
                    },
                    {
                        table: 'sn_aia_tool'
                        id: '78d788435197424c9616f9740b32cd55'
                        key: {
                            name: 'Assess Run'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7d1f671f11864be29d3b9fc94af66883'
                        key: {
                            sys_security_acl: 'f90099058ff04e4c8c04a162f9800819'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '830cb831b9594d47b5bbd97455c7568f'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'verdict'
                        }
                    },
                    {
                        table: 'sn_aia_trigger_agent_usecase_m2m'
                        id: '83dd5477c05f4f16bed37ed5399c7a57'
                        key: {
                            trigger_configuration: {
                                id: '9db9c892bfee4ffdaec0adfbeee7738c'
                                key: {
                                    name: 'Legwork run scored'
                                    usecase: '1ae2ccb9a20e4706a769942ea16b63c4'
                                }
                            }
                            related_resource_record: '1ae2ccb9a20e4706a769942ea16b63c4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '85db0a089fcb4093b7c1827c3879f719'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'agent_log'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: '85f56e53cec34f73a373b763f5fc4613'
                        key: {
                            agent_access_config: {
                                id: 'c81d8f733e3c497cbea2ab7cf18c810c'
                                key: {
                                    agent: '922ecd6b69144afab8eb2d851989b81a'
                                }
                            }
                            role: {
                                id: '3747ac2b0cc64cdba153a1a430d6bc37'
                                key: {
                                    name: 'sn_hs_rm.risk_assessment_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8f18cfaa4d514a229532bed3f971de0d'
                        key: {
                            sys_security_acl: '7f1eb21c04d84800bddb3c4e9e5c0829'
                            sys_user_role: 'd526601cca98422a98ab78afedc13b6d'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8fce93ec5702417facdf27c672f566ba'
                        key: {
                            sys_security_acl: '5fe4db7e17c9466d8895e950965a82d4'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '914a68e66b404da0950d5c960965aa72'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'step_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_aia_version'
                        id: '942085386ecb4b96ab8219b043d5c3db'
                        key: {
                            target_id: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                            version_name: 'V1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9819fc1cf7234ea5b1b6519a5c345095'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9950903864f3477b9fcdf7e2e12def6f'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'state'
                            value: 'closed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9977f123cdb34d9fae42fbd31af03a22'
                        deleted: true
                        key: {
                            sys_security_acl: '7f0cff3ff13047f5ad01be7f999e8fba'
                            sys_user_role: '2831a114c611228501d4ea6c309d626d'
                        }
                    },
                    {
                        table: 'sn_aia_trigger_configuration'
                        id: '9db9c892bfee4ffdaec0adfbeee7738c'
                        key: {
                            name: 'Legwork run scored'
                            usecase: '1ae2ccb9a20e4706a769942ea16b63c4'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9f8ccff3c01e4c3181721b5c9b989763'
                        key: {
                            sys_security_acl: 'ab7fc869c6a1442b883b495f6b3d122b'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9ff131605341420ebfaa6a171ddf2ca8'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a056432a061348e1b4698440581c7b2d'
                        key: {
                            sys_security_acl: '75110acdad5241fa817ca39618962fba'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a16cb8323cc84db79e08e126ae77de48'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'drills'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a53861b4385648aa8a6f6c038a85a207'
                        key: {
                            sys_security_acl: 'ea342c7f81184a8ea27da4cc61b2d2f9'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: 'abaa673727f34b9da10f696779ec71a9'
                        key: {
                            agent_access_config: {
                                id: 'cf622258c7b9431a95fb4618f18d3340'
                                key: {
                                    agent: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                                }
                            }
                            role: {
                                id: 'fab3723f8c70466fbbeffc6b1118ab9e'
                                key: {
                                    name: 'sn_ohs_im.action_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: 'ad6077d9730d4bee9f421f627da6df7f'
                        key: {
                            agent_access_config: {
                                id: '2e70e2439fd24ea986c234b1017b5905'
                                key: {
                                    agent: '1ae2ccb9a20e4706a769942ea16b63c4'
                                }
                            }
                            role: {
                                id: 'eb31f1ed9c6c47909b53fe4ef2f24cc9'
                                key: {
                                    name: 'sn_ohs_im.action_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ae813c91826d498fab1598e5e26207e7'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'assessment'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'afea6365ca0b46798b6fbca67fc8a7ee'
                        key: {
                            sys_security_acl: '56c613cb333440d99ac05ab895586c74'
                            sys_user_role: 'd526601cca98422a98ab78afedc13b6d'
                        }
                    },
                    {
                        table: 'sn_aia_team_member'
                        id: 'b02e63086b0a4cebb5c38bd7e7ff4fde'
                        deleted: true
                        key: {
                            agent: 'e50f62e7b4eb484ca8af2b1768913274'
                            team: {
                                id: '382cfc322bcf438682d25907afd9a00a'
                                key: {
                                    name: 'Legwork Form Team'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b10df09ee84d44e78636e084cb1772ae'
                        key: {
                            sys_security_acl: '3a3468f262584b7aac46f5e94b48d772'
                            sys_user_role: 'd526601cca98422a98ab78afedc13b6d'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'b37a5ad0f7dd4ebc8090032c9b76f3bb'
                        key: {
                            name: 'x_snc_legwork_run'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: 'b4bdda05156544af802318a92e026e85'
                        key: {
                            agent_access_config: {
                                id: 'cf622258c7b9431a95fb4618f18d3340'
                                key: {
                                    agent: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                                }
                            }
                            role: {
                                id: 'd903874ff94340cb9072003e41c09366'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ba01c3ac3490441a99326a7ed92ba9b9'
                        key: {
                            sys_security_acl: '6e3905b5c0c648eab5a219c4502bb68a'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'bb2475afcbe044f4b26d075d8731a3ff'
                        deleted: true
                        key: {
                            sys_security_acl: '3a3468f262584b7aac46f5e94b48d772'
                            sys_user_role: '2831a114c611228501d4ea6c309d626d'
                        }
                    },
                    {
                        table: 'sn_aia_team_member'
                        id: 'c23573fc667e422ab1cc820a4991c3e7'
                        key: {
                            agent: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                            team: {
                                id: '382cfc322bcf438682d25907afd9a00a'
                                key: {
                                    name: 'Legwork Form Team'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c4c95adf4ee44bed8327ec5a7d472f36'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'target_table'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: 'c81d8f733e3c497cbea2ab7cf18c810c'
                        key: {
                            agent: '922ecd6b69144afab8eb2d851989b81a'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: 'c95ad3c6140247a5955640ab99a722f7'
                        key: {
                            agent: 'c24a14b64a3c4571b8d846f0f65ee49f'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ca9f04e287c0438db046a40c4976736c'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'runner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cba0af8e0ead48b6a7d33deeb8954083'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'baseline_run'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_configuration'
                        id: 'cf622258c7b9431a95fb4618f18d3340'
                        key: {
                            agent: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd1ca54a1341c4ab6b8922b5d33bc6172'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'd1d1d3786369427daaefd14ad7daeeed'
                        key: {
                            application_file: 'd29b971b8d0bd46e4cef0b9e8d5c2b5f'
                            source_artifact: '48c8e28fd4c34c3f893830a3ba282ebd'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd1fbc87b3db5462eb2237c9dbc0540f7'
                        key: {
                            sys_security_acl: '6097393b6418457f81cc89db2810300f'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd4fb580076774c87849997c32c41e7b7'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'target_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'd526601cca98422a98ab78afedc13b6d'
                        key: {
                            name: 'x_snc_legwork.user'
                        }
                    },
                    {
                        table: 'sn_aia_version'
                        id: 'd6cf098d38374b70993b5a9eab2e8dce'
                        key: {
                            target_id: '922ecd6b69144afab8eb2d851989b81a'
                            version_name: 'V1'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd8f606104fc0407392ebab2099c610d5'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'state'
                            value: 'scored'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_aia_version'
                        id: 'd9fd630adf9d4bce8026b92aaeaa0ff2'
                        key: {
                            target_id: 'c24a14b64a3c4571b8d846f0f65ee49f'
                            version_name: 'V1'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'db08029a587b4f94a4b9273c8aade388'
                        key: {
                            sys_security_acl: '5616ff08b9b64d21af579ee0f20db59b'
                            sys_user_role: {
                                id: 'd526601cca98422a98ab78afedc13b6d'
                                key: {
                                    name: 'x_snc_legwork.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_aia_agent_config'
                        id: 'db1077333f4a4d6ab9e9475c9c60d581'
                        key: {
                            agent: 'f6ed6cccb6c748e1b6186a485d8c4ca6'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'decdefd14171474381511f9e4d87aac4'
                        key: {
                            sys_security_acl: 'f90099058ff04e4c8c04a162f9800819'
                            sys_user_role: {
                                id: 'c4d08af8ff3244f7959913795b292309'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'df427701e6aa4220948c5312a4a15660'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'overstride'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df8dbaa413494b30a6acff0fabfb7838'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'dry_run'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dfacd7c7ca464558bf08c526306b5c21'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_agent_access_role_mapping'
                        id: 'e0dea3a18d9b4f38aa9c34ac22ab9914'
                        key: {
                            agent_access_config: {
                                id: '2e70e2439fd24ea986c234b1017b5905'
                                key: {
                                    agent: '1ae2ccb9a20e4706a769942ea16b63c4'
                                }
                            }
                            role: {
                                id: 'a0549978b798434fa598570be8c50e95'
                                key: {
                                    name: 'sn_hs_rm.risk_assessment_writer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e51b337b08c94593a987da85cc478f20'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'state'
                            value: 'clear'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e701d2a3730e44058fc87cba9804137c'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'assessment'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f0d5fe4908cd4367a944259c6828311e'
                        key: {
                            sys_security_acl: '7f0cff3ff13047f5ad01be7f999e8fba'
                            sys_user_role: 'd526601cca98422a98ab78afedc13b6d'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f328cece1e7345598f47f0c15a77887b'
                        key: {
                            name: 'x_snc_legwork_created'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f8bc83ea3fdf4d429a129c7e5fbbd660'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'run'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fe7c80ca7a714dcf9762b1d20318e0f3'
                        key: {
                            name: 'x_snc_legwork_run'
                            element: 'baseline_run'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ff2b2fd7c1904c2480aca545566c26e6'
                        key: {
                            name: 'x_snc_legwork_created'
                            element: 'label'
                        }
                    },
                ]
            }
        }
    }
}

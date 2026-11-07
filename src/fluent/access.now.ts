import '@servicenow/sdk/global'
import { Role, Acl } from '@servicenow/sdk/core'

export const legworkUser = Role({
    name: 'x_snc_legwork.user',
    description: 'Can record Legwork runs and see their agent progress',
    grantable: true,
})

// admin plus the Legwork role may read, write, create and delete both Legwork tables.
export const runRead = Acl({
    $id: Now.ID['legwork_run_read'],
    type: 'record',
    table: 'x_snc_legwork_run',
    operation: 'read',
    roles: [legworkUser, 'admin'],
})
export const runWrite = Acl({
    $id: Now.ID['legwork_run_write'],
    type: 'record',
    table: 'x_snc_legwork_run',
    operation: 'write',
    roles: [legworkUser, 'admin'],
})
export const runCreate = Acl({
    $id: Now.ID['legwork_run_create'],
    type: 'record',
    table: 'x_snc_legwork_run',
    operation: 'create',
    roles: [legworkUser, 'admin'],
})
export const runDelete = Acl({
    $id: Now.ID['legwork_run_delete'],
    type: 'record',
    table: 'x_snc_legwork_run',
    operation: 'delete',
    roles: [legworkUser, 'admin'],
})
export const createdRead = Acl({
    $id: Now.ID['legwork_created_read'],
    type: 'record',
    table: 'x_snc_legwork_created',
    operation: 'read',
    roles: [legworkUser, 'admin'],
})
export const createdWrite = Acl({
    $id: Now.ID['legwork_created_write'],
    type: 'record',
    table: 'x_snc_legwork_created',
    operation: 'write',
    roles: [legworkUser, 'admin'],
})
export const createdCreate = Acl({
    $id: Now.ID['legwork_created_create'],
    type: 'record',
    table: 'x_snc_legwork_created',
    operation: 'create',
    roles: [legworkUser, 'admin'],
})
export const createdDelete = Acl({
    $id: Now.ID['legwork_created_delete'],
    type: 'record',
    table: 'x_snc_legwork_created',
    operation: 'delete',
    roles: [legworkUser, 'admin'],
})

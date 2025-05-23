import { CanPerform, Action, AppAbilityType, CurrentAbility } from '@eleven-am/authorizer';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentSession } from '../authorisation/auth.decorators';
import { CachedSession } from '../session/session.contracts';
import { PaginateArgs } from '../utils/utils.contracts';

import { AuthKeyEntitySchema, PageResponseAuthKeySchema } from './authkey.contracts';
import { AuthKeyService } from './authkey.service';


@Controller('authKeys')
@ApiTags('AuthKeys')
export class AuthKeyController {
    constructor (private readonly authKeyService: AuthKeyService) {}

    @Get()
    @ApiOkResponse({
        description: 'Get all auth keys',
        type: PageResponseAuthKeySchema,
    })
    @ApiOperation({
        summary: 'Get all auth keys',
        description: 'Get all auth keys for the current user',
    })
    @CanPerform({
        action: Action.Read,
        resource: 'AuthKey',
    })
    getAuthKeys (@CurrentAbility.HTTP() ability: AppAbilityType, @Query() query: PaginateArgs) {
        return this.authKeyService.getAuthKeys(query, ability);
    }

    @Post()
    @ApiCreatedResponse({
        description: 'Create an auth key',
        type: AuthKeyEntitySchema,
    })
    @ApiOperation({
        summary: 'Create an auth key',
        description: 'Create an auth key for the current user',
    })
    @CanPerform({
        action: Action.Create,
        resource: 'AuthKey',
    })
    createAuthKey (@CurrentSession.HTTP() session: CachedSession) {
        return this.authKeyService.createAuthKey(session.userId);
    }

    @Get(':authKey')
    @ApiOkResponse({
        description: 'Get an auth key by key',
        type: AuthKeyEntitySchema,
    })
    @ApiOperation({
        summary: 'Get an auth key by key',
        description: 'Get an auth key by key, returns an authKey only if it is not revoked',
    })
    @ApiParam({
        name: 'authKey',
        type: String,
        description: 'The auth key to use for the download',
    })
    findByAuthKey (@Param('authKey') authKey: string) {
        return this.authKeyService.findByAuthKey(authKey)
    }
}

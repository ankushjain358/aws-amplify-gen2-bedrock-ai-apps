import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'app-bucket',
    access: (allow) => ({
        'temp-files/*': [
            allow.entity('identity').to(['read', 'write', 'delete'])
        ]
    })
});
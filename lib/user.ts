interface user {
    id: number,
    fullname: string
}

const User: user = {
    id : 101,
    fullname: 'TypeScripter'
}

function getUserFromApi(userId: number): Promise<user> {
    return new Promise(() => ))
}

async function getUser(userId: number): Promise<user> {
    return await getUserFromApi(userId);
}

console.log(getUser(101))
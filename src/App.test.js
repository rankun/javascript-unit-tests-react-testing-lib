import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
    rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
        return res(ctx.json([
            {
                "id": 1,
                "name": "Leanne Graham",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough"
                },
                "phone": "1-770-736-8031 x56442",
                "website": "hildegard.org",
                "company": { "name": "Romaguera-Crona" },
            },
        ]))
    }),
    rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
        return res(ctx.json([
            {
                "id": 1,
                "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
                "userId": 1
            }
        ]))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('All User and Post objects properties visible', async () => {
    render(<App />)
    
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Dados dos usuários não carregados do servidor.')

    await waitFor(() => screen.getByTestId('user-1'))

    expect(screen.getByTestId('username-1')).toHaveTextContent('Username: Bret')
    expect(screen.queryByTestId('id-1')).toHaveTextContent('User Id: 1')
    expect(screen.getByTestId('name-1')).toHaveTextContent('Name: Leanne Graham')
    expect(screen.getByTestId('address-1')).toHaveTextContent('Address: Kulas Light Apt. 556 Gwenborough')
    expect(screen.getByTestId('phone-1')).toHaveTextContent('Phone: 1-770-736-8031 x56442')
    expect(screen.getByTestId('company-1')).toHaveTextContent('Company: Romaguera-Crona')
    expect(screen.getByTestId('website-1')).toHaveTextContent('Website: hildegard.org')

    await waitFor(() => screen.getByTestId('posttitle-1'))

    expect(screen.queryByText('Posts:')).toBeVisible()
    expect(screen.getByTestId('postid-1')).toHaveTextContent('Post id: 1')
    expect(screen.getByTestId('posttitle-1')).toHaveTextContent('Post title: sunt aut facere repellat provident occaecati excepturi optio reprehenderit')
    expect(screen.getByTestId('postbody-1')).toHaveTextContent('Post body: quia et suscipit')

    expect(screen.queryByText('ID: 2')).toBeNull()


})

test('users request status 500', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.status(500))
        }),
    )

    render(<App />)

    expect(screen.getByTestId('loading-message')).toHaveTextContent('Dados dos usuários não carregados do servidor.')

    await waitFor(() => screen.getByTestId('loading-message'))

    expect(screen.getByTestId('loading-message')).toHaveTextContent('Um erro ocorreu ao carregar dados dos usuários do servidor.')


})

test('users request status 400', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.status(400))
        }),
    )

    render(<App />)

    expect(screen.getByTestId('loading-message')).toHaveTextContent('Dados dos usuários não carregados do servidor.')

    await waitFor(() => screen.getByTestId('loading-message'))

    expect(screen.getByTestId('loading-message')).toHaveTextContent('Um erro ocorreu ao carregar dados dos usuários do servidor.')


})

test('users request status 300', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.status(300))
        }),
    )

    render(<App />)

    expect(screen.getByTestId('loading-message')).toHaveTextContent('Dados dos usuários não carregados do servidor.')

    await waitFor(() => screen.getByTestId('loading-message'))

    expect(screen.getByTestId('loading-message')).toHaveTextContent('Um erro ocorreu ao carregar dados dos usuários do servidor.')


})

test('userId is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "NOT_id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('User Id: 1')).toBeNull()


})

test('username is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "name": "Leanne Graham",
                    "NOT_username": "Bret",
                    "email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)
    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Username: Bret')).toBeNull()


})

test('name is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "NOT_name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Name: Leanne Graham')).toBeNull()
})

test('email is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "NOT_email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Email: Sincere@april.biz')).toBeNull()
})

test('address is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "NOT_address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Address: Kulas Light Apt. 556 Gwenborough')).toBeNull()
})

test('phone is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "NOT_phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Phone: 1-770-736-8031 x56442')).toBeNull()
})

test('website is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "phone": "1-770-736-8031 x56442",
                    "NOT_website": "hildegard.org",
                    "company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Website: hildegard.org')).toBeNull()
})

test('company is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough"
                    },
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "NOT_company": { "name": "Romaguera-Crona" },
                },
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Company: Romaguera-Crona')).toBeNull()
})

test('post title is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "NOT_title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
                    "userId": 1
                }
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Post title: sunt aut facere repellat provident occaecati excepturi optio reprehenderit')).toBeNull()
})

test('post body is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "id": 1,
                    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                    "NOT_body": "quia et suscipit suscipit recusandae consequuntur expedita et cum",
                    "userId": 1
                }
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Post body: quia et suscipit suscipit recusandae consequuntur expedita et cum')).toBeNull()
})

test('post id is not visible', async () => {
    server.use(
        rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
            return res(ctx.json([
                {
                    "NOT_id": 1,
                    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                    "NOT_body": "quia et suscipit suscipit recusandae consequuntur expedita et cum",
                    "userId": 1
                }
            ]))
        }),
    )
    render(<App />)

    await waitFor(() => screen.queryByText('Dados dos usuários carregados do servidor.'))

    expect(screen.queryByText('Post id: 1')).toBeNull()
})



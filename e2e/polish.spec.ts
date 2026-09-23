import { expect, test, type Page } from '@playwright/test'

async function mockModule(
  page: Page,
  path: string,
  edit: (body: string) => string,
) {
  await page.route(`**/src/${path}.ts*`, async (route) => {
    const response = await route.fetch()
    const body = await response.text()
    const changed = edit(body)
    expect(changed).not.toBe(body)
    await route.fulfill({ response, body: changed })
  })
}

async function enterDemo(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()
}

test('status automático, cancelamento e confirmação da conclusão', async ({
  page,
}) => {
  await enterDemo(page)
  await page.goto('/ordens/demo-order-1047')
  await expect(
    page.getByText('Selecione um status. A alteração é salva automaticamente.'),
  ).toBeVisible()
  await page.getByLabel('Status da ordem').selectOption('in_progress')
  await expect(page.getByRole('status').last()).toHaveText('Status atualizado.')
  await expect(page.getByLabel('Status da ordem')).toHaveValue('in_progress')
  await page.getByRole('button', { name: 'Concluir ordem' }).click()
  await page.getByRole('button', { name: 'Cancelar' }).click()
  await expect(page.getByLabel('Status da ordem')).toHaveValue('in_progress')
  await page.getByRole('button', { name: 'Concluir ordem' }).click()
  await page.getByRole('button', { name: 'Confirmar conclusão' }).click()
  await expect(page.getByLabel('Status da ordem')).toHaveValue('completed')
  await expect(
    page.getByRole('button', { name: 'Concluir ordem' }),
  ).toHaveCount(0)
})

test('seleção direta de Concluído não depende da ação dedicada', async ({
  page,
}) => {
  await enterDemo(page)
  await page.goto('/ordens/demo-order-1047')
  await page.getByLabel('Status da ordem').selectOption('completed')
  await expect(page.getByRole('status').last()).toHaveText('Status atualizado.')
  await expect(page.getByLabel('Status da ordem')).toHaveValue('completed')
  await expect(
    page.getByRole('button', { name: 'Concluir ordem' }),
  ).toHaveCount(0)
})

test('falha de mutation mantém status real e mostra somente erro', async ({
  page,
}) => {
  await mockModule(page, 'data/repositories/demo', (body) =>
    body.replace(
      'async updateStatus(id, status) {',
      'async updateStatus(id, status) { await new Promise(resolve => setTimeout(resolve, 1000)); throw new Error("Falha simulada");',
    ),
  )
  await enterDemo(page)
  await page.goto('/ordens/demo-order-1047')
  await page.getByLabel('Status da ordem').selectOption('in_progress')
  await expect(page.getByRole('status').last()).toHaveText(
    'Salvando alteração...',
  )
  await expect(page.getByLabel('Status da ordem')).toBeDisabled()
  await expect(page.getByRole('alert')).toHaveText(
    'Não foi possível atualizar o status. Tente novamente.',
  )
  await expect(page.getByLabel('Status da ordem')).toHaveValue('waiting')
  await expect(page.getByText('Status atualizado.')).toHaveCount(0)
})

test('UUID permanece na rota enquanto OS-1001 aparece na apresentação e busca', async ({
  page,
}) => {
  const uuid = '11111111-2222-4333-8444-555555555555'
  await mockModule(page, 'data/demo', (body) =>
    body.replace(
      'id: "demo-order-1048",\n\t\tcode: "OS-1048"',
      `id: "${uuid}",\n\t\tcode: "OS-1001"`,
    ),
  )
  await enterDemo(page)
  await expect(
    page.getByRole('region', { name: 'Ordens recentes' }),
  ).toContainText('OS-1001')
  await page.goto('/ordens')
  await page.getByRole('textbox', { name: 'Pesquisar ordens' }).fill('OS-1001')
  const order = page.getByRole('link', { name: /OS-1001/ })
  await expect(order).toHaveAttribute('href', `/ordens/${uuid}`)
  await expect(order).not.toContainText(uuid)
  await order.click()
  await expect(page.getByText('Ordem OS-1001')).toBeVisible()
})

test('cadastro a partir da nova OS retorna com cliente selecionado; cancelamento volta à origem', async ({
  page,
}) => {
  await mockModule(page, 'data/demo', (body) =>
    body.replace(
      'export const demoCustomers = [',
      'export const demoCustomers = []; export const unusedCustomers = [',
    ),
  )
  await enterDemo(page)
  await page.goto('/ordens/nova')
  await expect(
    page.getByText('É necessário cadastrar um cliente antes de criar a ordem.'),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Cadastrar cliente' }).click()
  await page.getByRole('link', { name: 'Cancelar' }).click()
  await expect(page).toHaveURL(/\/ordens\/nova$/)
  await page.getByRole('link', { name: 'Cadastrar cliente' }).click()
  await page.getByRole('textbox', { name: /Nome/ }).fill('Cliente da ordem')
  await page.getByRole('button', { name: 'Cadastrar cliente' }).click()
  await expect(page).toHaveURL(/\/ordens\/nova\?cliente=[0-9a-f-]+$/)
  await expect(page.getByLabel('Cliente', { exact: false })).toHaveValue(
    /[0-9a-f-]+/,
  )
  await expect(page.getByLabel('Cliente', { exact: false })).toContainText(
    'Cliente da ordem',
  )
})

test('novo cliente com lista populada retorna à OS; rascunho não é descartado sem aviso', async ({
  page,
}) => {
  await enterDemo(page)
  await page.goto('/ordens/nova')
  await page
    .getByRole('textbox', { name: /Título\/serviço/ })
    .fill('Rascunho de serviço')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('link', { name: '+ Novo cliente' }).click()
  await expect(
    page.getByRole('textbox', { name: /Título\/serviço/ }),
  ).toHaveValue('Rascunho de serviço')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('link', { name: '+ Novo cliente' }).click()
  await page.getByRole('textbox', { name: /Nome/ }).fill('Cliente adicional')
  await page.getByRole('button', { name: 'Cadastrar cliente' }).click()
  await expect(page.getByLabel('Cliente', { exact: false })).toContainText(
    'Cliente adicional',
  )
  await expect(page.getByLabel('Cliente', { exact: false })).toHaveValue(
    /[0-9a-f-]+/,
  )
})

test('base vazia e pesquisa sem resultados têm orientações distintas', async ({
  page,
}) => {
  await mockModule(page, 'data/demo', (body) =>
    body.replace(
      'export const demoOrders = createDemoOrders(new Date())',
      'export const demoOrders = []',
    ),
  )
  await enterDemo(page)
  await page.goto('/ordens')
  await expect(
    page.getByRole('heading', { name: 'Sua primeira ordem começa aqui' }),
  ).toBeVisible()
  await expect(
    page.getByText('Ajuste a pesquisa ou o filtro de status.'),
  ).toHaveCount(0)
})

test('conta autenticada recém-criada apresenta estados vazios sem serviço remoto', async ({
  page,
}) => {
  await mockModule(
    page,
    'data/supabase/client',
    () => `
    const session = { user: { id: 'new-user' } }
    export const supabase = {
      auth: {
        getSession: async () => ({ data: { session } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({ error: null }),
      },
    }
  `,
  )
  await mockModule(
    page,
    'data/repositories/supabase',
    () => `
    export class SupabaseCustomerRepository { async list() { return [] } }
    export class SupabaseWorkOrderRepository { async list() { return [] } }
  `,
  )
  await page.goto('/')
  await expect(page.getByTestId('metric-completed')).toContainText('0')
  await expect(page.getByTestId('metric-revenue')).toContainText('R$ 0,00')
  await expect(
    page.getByRole('region', { name: 'Ordens recentes' }),
  ).toContainText('Nenhuma ordem registrada.')
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Clientes' })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Sua lista começa aqui' }),
  ).toBeVisible()
})

test('pesquisa sem resultados em base populada', async ({ page }) => {
  await enterDemo(page)
  await page.goto('/ordens')
  await page
    .getByRole('textbox', { name: 'Pesquisar ordens' })
    .fill('serviço inexistente xyz')
  await expect(
    page.getByRole('heading', { name: 'Nenhuma ordem encontrada' }),
  ).toBeVisible()
})

for (const width of [360, 390, 768]) {
  test(`fluxo polido sem overflow em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 780 })
    await enterDemo(page)
    for (const path of [
      '/ordens',
      '/ordens/nova',
      '/ordens/demo-order-1047',
      '/clientes',
      '/clientes/marina',
      '/clientes/novo',
    ]) {
      await page.goto(path)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width)
    }
  })
}

import { expect, test } from '@playwright/test'

test('dashboard, shell desktop e rota desconhecida', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()
  await expect(
    page.getByRole('heading', { name: /(Bom dia|Boa tarde|Boa noite)/ }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Ordens recentes' }),
  ).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Navegação principal' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Nova ordem' })).toBeVisible()
  await page.getByRole('link', { name: 'Nova ordem' }).click()
  await expect(page.getByRole('heading', { name: 'Nova ordem' })).toBeVisible()
  await page.getByRole('link', { name: 'Voltar', exact: true }).click()
  await page
    .getByRole('link', { name: 'GestorFlow, voltar ao início' })
    .first()
    .click()
  await expect(page).toHaveURL('/')
  await page.goto('/rota-inexistente')
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Voltar ao início', exact: true })
    .click()
  await expect(page).toHaveURL('/')
  expect(errors).toEqual([])
  await page.screenshot({
    path: 'test-results/dashboard-desktop.png',
    fullPage: true,
  })
})

for (const width of [360, 390]) {
  test(`dashboard e navegação mobile em ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 780 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração' }).click()
    await expect(
      page.getByRole('heading', { name: /(Bom dia|Boa tarde|Boa noite)/ }),
    ).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Navegação mobile' }),
    ).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeHidden()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
    expect(errors).toEqual([])
    await page.screenshot({
      path: `test-results/dashboard-${width}.png`,
      fullPage: true,
    })
  })
}

test('demo funciona sem Supabase e reinicia mutações no reload', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Clientes' })
    .click()
  await page.getByRole('link', { name: 'Novo cliente' }).click()
  await page.getByRole('textbox', { name: /Nome/ }).fill('Cliente descartável')
  await page.getByRole('button', { name: 'Cadastrar cliente' }).click()
  await expect(
    page.getByRole('heading', { name: 'Cliente descartável' }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Cliente não encontrado' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Voltar para clientes' }).click()
  await expect(
    page.getByRole('heading', { name: 'Clientes', exact: true }),
  ).toBeVisible()
})

test('entrada oferece autenticação e cadastro sem depender de serviço remoto', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  await page.getByRole('button', { name: 'Voltar' }).click()
  await page.getByRole('button', { name: 'Criar conta' }).click()
  await expect(page.getByRole('heading', { name: 'Criar conta' })).toBeVisible()
  await page.getByRole('button', { name: 'Voltar' }).click()
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()
  await expect(
    page.getByRole('heading', { name: /(Bom dia|Boa tarde|Boa noite)/ }),
  ).toBeVisible()
})

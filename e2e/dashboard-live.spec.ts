import { expect, test } from '@playwright/test'

test('golden path público da demo funciona sem requisições externas e reinicia no reload', async ({
  page,
}) => {
  const errors: string[] = []
  const externalRequests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === 'http://127.0.0.1:4173')
      return route.continue()
    externalRequests.push(route.request().url())
    return route.abort()
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()
  await expect(page.getByTestId('metric-completed')).toContainText('2')
  await expect(page.getByTestId('metric-revenue')).toContainText('R$ 2.960,00')
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Clientes' })
    .click()
  await page.getByRole('link', { name: /Marina Albuquerque/ }).click()
  await expect(
    page.getByRole('heading', { name: 'Marina Albuquerque' }),
  ).toBeVisible()
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Ordens de serviço' })
    .click()
  await page.getByRole('link', { name: 'Nova ordem' }).last().click()
  await page.getByLabel('Cliente', { exact: false }).selectOption('marina')
  await page
    .getByRole('textbox', { name: /Título\/serviço/ })
    .fill('Serviço público descartável')
  await page.getByLabel('Valor (R$)').fill('300')
  await page.getByRole('button', { name: 'Criar ordem' }).click()
  await page.getByLabel('Status da ordem').selectOption('in_progress')
  await expect(page.getByRole('status').last()).toHaveText('Status atualizado.')
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Visão geral' })
    .click()
  await page
    .getByRole('region', { name: 'Ordens recentes' })
    .getByRole('link', { name: /Serviço público descartável/ })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Serviço público descartável' }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Ordem não encontrada' }),
  ).toBeVisible()
  await page.goto('/')
  await expect(page.getByTestId('metric-completed')).toContainText('2')
  await expect(page.getByTestId('metric-in-progress')).toContainText('2')
  await expect(
    page.getByRole('region', { name: 'Ordens recentes' }),
  ).not.toContainText('Serviço público descartável')
  expect(errors).toEqual([])
  expect(externalRequests).toEqual([])
})

test('rotas principais abrem diretamente com a demo ativa', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()

  for (const [path, heading] of [
    ['/clientes', 'Clientes'],
    ['/clientes/marina', 'Marina Albuquerque'],
    ['/ordens', 'Ordens de serviço'],
    ['/ordens/demo-order-1048', 'Identidade visual'],
  ]) {
    await page.goto(path)
    await expect(
      page.getByRole('heading', { name: heading, exact: true }),
    ).toBeVisible()
  }
})

test('ordem recente abre a ficha pelo clique na linha e pelo teclado', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()

  const recent = page.getByRole('region', { name: 'Ordens recentes' })
  const order = recent.getByRole('link', { name: /Identidade visual.*OS-1048/ })
  await expect(order).toBeVisible()
  await expect(order).toHaveAttribute('href', '/ordens/demo-order-1048')
  await order.click({ position: { x: 300, y: 20 } })
  await expect(page).toHaveURL(/\/ordens\/demo-order-1048$/)
  await expect(
    page.getByRole('heading', { name: 'Identidade visual' }),
  ).toBeVisible()
  await expect(page.getByText('Ordem OS-1048')).toBeVisible()

  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Visão geral' })
    .click()
  await page.getByRole('link', { name: 'Nova ordem' }).focus()
  await page.keyboard.press('Tab')
  await expect(order).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/ordens\/demo-order-1048$/)
  await expect(
    page.getByRole('heading', { name: 'Identidade visual' }),
  ).toBeVisible()
})

for (const width of [360, 390]) {
  test(`dashboard sem overflow horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 780 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração' }).click()
    await expect(
      page.getByRole('region', { name: 'Ordens recentes' }).getByRole('link'),
    ).not.toHaveCount(0)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  })
}

test('dashboard acompanha criação, andamento e conclusão de ordem na demo', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()
  const progress = page.getByTestId('metric-in-progress')
  const completed = page.getByTestId('metric-completed')
  const revenue = page.getByTestId('metric-revenue')
  const initialProgress = Number(
    await progress.locator('p.font-display').textContent(),
  )
  const initialCompleted = Number(
    await completed.locator('p.font-display').textContent(),
  )
  const currencyValue = (text: string | null) =>
    Number((text ?? '').replace(/[^\d,]/g, '').replace(',', '.'))
  const initialRevenue = currencyValue(
    await revenue.locator('p.font-display').textContent(),
  )
  await page.getByRole('link', { name: 'Nova ordem' }).click()
  await page.getByLabel('Cliente', { exact: false }).selectOption('marina')
  await page
    .getByRole('textbox', { name: /Título\/serviço/ })
    .fill('Serviço dashboard')
  await page.getByLabel('Valor (R$)').fill('850.50')
  await page.getByRole('button', { name: 'Criar ordem' }).click()
  await expect(
    page.getByRole('heading', { name: 'Serviço dashboard' }),
  ).toBeVisible()
  await expect(page.getByText('OS-1049').first()).toBeVisible()
  await page.getByLabel('Status da ordem').selectOption('in_progress')
  await expect(page.getByRole('status').last()).toHaveText('Status atualizado.')
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Visão geral' })
    .click()
  await expect(progress.locator('p.font-display')).toHaveText(
    String(initialProgress + 1),
  )
  await expect(
    page.getByRole('region', { name: 'Ordens recentes' }),
  ).toContainText('Serviço dashboard · OS-1049')
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Ordens de serviço' })
    .click()
  await page.getByRole('link', { name: /Serviço dashboard/ }).click()
  await page.getByRole('button', { name: 'Concluir ordem' }).click()
  await page.getByRole('button', { name: 'Confirmar conclusão' }).click()
  await expect(page.getByLabel('Status da ordem')).toHaveValue('completed')
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Visão geral' })
    .click()
  await expect(progress.locator('p.font-display')).toHaveText(
    String(initialProgress),
  )
  await expect(completed.locator('p.font-display')).toHaveText(
    String(initialCompleted + 1),
  )
  expect(
    currencyValue(await revenue.locator('p.font-display').textContent()),
  ).toBeCloseTo(initialRevenue + 850.5)
  await expect(
    page.getByRole('region', { name: 'Ordens recentes' }),
  ).toContainText('Serviço dashboard · OS-1049')
})

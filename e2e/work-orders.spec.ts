import { expect, test, type Page } from '@playwright/test'

async function noOverflow(page: Page, width: number) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(width)
}

test('lista, pesquisa, filtro, detalhe, criação, edição e associação com cliente', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('button', { name: 'Explorar demonstração' }).click()
  await page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Ordens de serviço' })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Ordens de serviço' }),
  ).toBeVisible()
  await page.getByRole('textbox', { name: 'Pesquisar ordens' }).fill('cafe')
  await expect(page.getByRole('link', { name: /Café Aurora/ })).toBeVisible()
  await page.getByLabel('Status', { exact: true }).selectOption('in_progress')
  await expect(
    page.getByRole('heading', { name: 'Nenhuma ordem encontrada' }),
  ).toBeVisible()
  await page.getByLabel('Status', { exact: true }).selectOption('waiting')
  await page.getByRole('link', { name: /Café Aurora/ }).click()
  await expect(
    page.getByRole('heading', { name: 'Manutenção de equipamentos' }),
  ).toBeVisible()
  await expect(
    page.getByText('Revisão preventiva dos equipamentos do café.'),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Voltar para ordens' }).click()
  await page.getByRole('link', { name: 'Nova ordem' }).last().click()
  await page.getByRole('button', { name: 'Criar ordem' }).click()
  await expect(page.getByRole('alert')).toContainText([
    'Selecione um cliente.',
    'Informe o serviço.',
  ])
  await page.getByLabel('Cliente', { exact: false }).selectOption('marina')
  await page
    .getByRole('textbox', { name: /Título\/serviço/ })
    .fill('Ensaio fotográfico')
  await page
    .getByRole('textbox', { name: /Descrição/ })
    .fill('Fotos para catálogo.')
  await page.getByLabel('Valor (R$)').fill('350')
  await page.getByRole('button', { name: 'Criar ordem' }).click()
  await expect(page.getByRole('status').first()).toHaveText(
    'Ordem criada com sucesso.',
  )
  await expect(page.getByText('OS-1049').first()).toBeVisible()
  await page.getByRole('link', { name: 'Editar ordem' }).click()
  await page
    .getByRole('textbox', { name: /Título\/serviço/ })
    .fill('Ensaio fotográfico comercial')
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  await expect(page.getByRole('status').first()).toHaveText(
    'Ordem atualizada com sucesso.',
  )
  await expect(
    page.getByRole('heading', { name: 'Ensaio fotográfico comercial' }),
  ).toBeVisible()
  await page.getByLabel('Status da ordem').selectOption('in_progress')
  await expect(page.getByRole('status').last()).toContainText('Em andamento')
  await page.getByRole('button', { name: 'Concluir ordem' }).click()
  await expect(page.getByRole('status').last()).toContainText('Concluído')
  await page.getByRole('link', { name: 'Marina Albuquerque' }).click()
  await expect(
    page.getByRole('link', { name: 'Ensaio fotográfico comercial' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Nova ordem' }).click()
  await expect(page.getByLabel('Cliente', { exact: false })).toHaveValue(
    'marina',
  )
  await page
    .getByRole('textbox', { name: /Título\/serviço/ })
    .fill('Cartão de visita')
  await page.getByRole('button', { name: 'Criar ordem' }).click()
  await expect(page.getByText('OS-1050').first()).toBeVisible()
  await page.getByRole('link', { name: 'Marina Albuquerque' }).click()
  await expect(
    page.getByRole('link', { name: 'Cartão de visita' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Voltar para clientes' }).click()
  await page.getByRole('link', { name: /Café Aurora/ }).click()
  await expect(
    page.getByRole('link', { name: 'Cartão de visita' }),
  ).toHaveCount(0)
  await page.getByRole('link', { name: 'Editar cliente' }).click()
  await page.getByRole('textbox', { name: /Nome/ }).fill('Café Aurora Centro')
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  await page.getByRole('link', { name: 'Manutenção de equipamentos' }).click()
  await expect(
    page.getByRole('link', { name: 'Café Aurora Centro' }),
  ).toBeVisible()
  await page.goto('/ordens/demo-order-inexistente')
  await expect(
    page.getByRole('heading', { name: 'Ordem não encontrada' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Voltar para ordens' }).click()
  await expect(
    page.getByRole('heading', { name: 'Ordens de serviço' }),
  ).toBeVisible()
  expect(errors).toEqual([])
})

for (const width of [360, 390]) {
  test(`ordens em viewport de ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 780 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explorar demonstração' }).click()
    await page
      .getByRole('navigation', { name: 'Navegação mobile' })
      .getByRole('link', { name: 'Ordens' })
      .click()
    await noOverflow(page, width)
    await page.getByRole('textbox', { name: 'Pesquisar ordens' }).fill('marina')
    await page.getByRole('link', { name: /Marina Albuquerque/ }).click()
    await noOverflow(page, width)
    await page.getByRole('link', { name: 'Editar ordem' }).click()
    await expect(
      page.getByRole('heading', { name: 'Editar ordem' }),
    ).toBeVisible()
    await noOverflow(page, width)
    await page.getByRole('link', { name: 'Voltar', exact: true }).click()
    await page.getByRole('link', { name: 'Voltar para ordens' }).click()
    await page.getByRole('link', { name: 'Nova ordem' }).click()
    await noOverflow(page, width)
    await page.getByLabel('Cliente', { exact: false }).selectOption('marina')
    await page
      .getByRole('textbox', { name: /Título\/serviço/ })
      .fill('Peças para redes sociais')
    await page.getByRole('button', { name: 'Criar ordem' }).click()
    await expect(
      page.getByRole('heading', { name: 'Peças para redes sociais' }),
    ).toBeVisible()
    await noOverflow(page, width)
    expect(errors).toEqual([])
  })
}

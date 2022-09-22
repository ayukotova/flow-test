const itemsQuery = `
{
  countries {
    code,
    name,
    native
    phone,
    continent {
      code,
      name,
    },
    capital,
    currency,
    languages {
      code,
      name,
      native,
      rtl
    }
    emoji,
    emojiU,
    states {
      code,
      name
    }
  }
}    
`
const itemsFilteredByRegexCodeQuery = `
{
  countries(filter : { code : { regex : "^A" } } ) {
    code,
    name,
    }
  }         
`
const itemsFilteredByGlobCodeQuery = `
{
  countries(filter : { code : { glob : "*CA*" } } ) {
    code,
    }
  }         
`
const itemsFilteredByNinCurrencyQuery = `
{
  countries(filter : { currency : { nin : ["AMD", "USD"] } } ) {
      name,
      currency,
    }
  }         
`
const itemsFilteredByContinentQuery = `
{
  countries(filter : { continent : { eq : "AS" } } ) {
      continent {
        code,
        name,
      },  
    }
  }         
`
const itemsFilteredByNeContinentQuery = `
{
  countries(filter : { continent : { ne : "AS" } } ) {
      name,
      continent {
        code,
        name,
      },
    }
  }         
`
const itemsFilteredByInCurrencyQuery = `
{
  countries(filter : { currency : { in : ["AMD", "USD"] } } ) {
      currency,
    }
  }         
`
const itemsFilteredByNonExistingCodeQuery = `
{
  countries(filter : { code : { eq : "12345" } } ) {
    code,
    }
  }         
`

const graphQLRequest = (query) => cy.request({
  method: 'POST',
  url: 'https://countries.trevorblades.com/',
  body: {
    query,
  },
})

it('fetches all items', () => {
  cy.fixture('allItems.json').then((allItemsFixture) => {
    graphQLRequest(itemsQuery).then((response) => {
      expect(response.body).to.not.be.empty
      expect(response.body.data).to.have.any.keys('countries')

      for (let i = 0; i < response.body.data.countries.len; i++) {
        expect(response.body.data.countries[i]).to.have.any.keys('code')
        expect(response.body.data.countries[i]).to.have.any.keys('name')
        expect(response.body.data.countries[i]).to.have.any.keys('native')
        expect(response.body.data.countries[i]).to.have.any.keys('phone')
        expect(response.body.data.countries[i]).to.have.any.keys('continent')
        expect(response.body.data.countries[i]).to.have.any.keys('capital')
        expect(response.body.data.countries[i]).to.have.any.keys('currency')
        expect(response.body.data.countries[i]).to.have.any.keys('languages')
        expect(response.body.data.countries[i]).to.have.any.keys('emoji')
        expect(response.body.data.countries[i]).to.have.any.keys('emojiU')
        expect(response.body.data.countries[i]).to.have.any.keys('states')

      }

      expect(response.body.data.countries).to.have.length(250)
      expect(JSON.stringify(response.body)).to.deep.equal(JSON.stringify(allItemsFixture))
    })
  })
})


it('fetches all items filtered by _regex_ code', () => {
  graphQLRequest(itemsFilteredByRegexCodeQuery).then((response) => {
    expect(response.body).to.not.be.empty
    expect(response.body.data).to.have.any.keys('countries')
    expect(response.body.data.countries).to.have.length(16)
  })
})

it('fetches all items filtered by _glob_ code', () => {
  /*
  This test should pass but there is a bug here 
  because it responds with INTERNAL_SERVER_ERROR
  */

  graphQLRequest(itemsFilteredByGlobCodeQuery).then((response) => {
    expect(response.body.data).to.have.any.keys('countries')
    expect(response.body).to.not.have.any.keys('errors')
  })
})

it('fetches all items filtered by _eq_ continent', () => {
  graphQLRequest(itemsFilteredByContinentQuery).then((response) => {
    expect(response.body).to.not.be.empty
    expect(response.body.data).to.have.any.keys('countries')
    expect(response.body.data.countries).to.have.length(52)
  })
})

it('fetches all items filtered by _ne_ continent', () => {
  graphQLRequest(itemsFilteredByNeContinentQuery).then((response) => {
    expect(response.body).to.not.be.empty
    expect(response.body.data).to.have.any.keys('countries')
    expect(response.body.data.countries).to.have.length(198)
  })
})

it('fetches all items filtered by _nin_ currency', () => {
  graphQLRequest(itemsFilteredByNinCurrencyQuery).then((response) => {
    expect(response.body).to.not.be.empty
    expect(response.body.data).to.have.any.keys('countries')
    expect(response.body.data.countries).to.have.length(234)
  })
})

it('fetches all items filtered by _in_ currency', () => {
  graphQLRequest(itemsFilteredByInCurrencyQuery).then((response) => {
    expect(response.body).to.not.be.empty
    expect(response.body.data).to.have.any.keys('countries')
    expect(response.body.data.countries).to.have.length(16)
  })
})

it('fetches all items filtered by non existing code', () => {
  graphQLRequest(itemsFilteredByNonExistingCodeQuery).then((response) => {
    expect(response.body).to.not.be.empty
    expect(response.body.data).to.have.any.keys('countries')
    expect(response.body.data.countries).to.have.length(0)
  })
})

it('fetches all items filtered by very long non existing code', () => {
  /*
  This test should pass but there is a bug here 
  because the request times out 
  It should responds with some error
  */
  
  const text = new Array(100000000).join('a');
  graphQLRequest(`
  {
    countries(filter : { code : { eq : "${text}}" } } ) {
      code,
      name,
      }
    }         
  `).then((response) => {
    expect(response.body).to.have.any.keys('errors')
  })
})
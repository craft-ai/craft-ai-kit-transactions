import _ from 'lodash';
import Kit from '../src';
import test from 'ava';

const orders = [
  {
    id: 'CH-A13H1-ORD',
    date: new Date('2017-12-01'),
    clientId: 'C1234',
    articles: [
      {
        productId: 'APPLE-1',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 12,
        price: 40
      },
      {
        productId: 'BANANA-4',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 4,
        price: 12
      }
    ]
  },
  {
    id: 'CH-A13H1-ORD',
    date: new Date('2017-12-05'),
    clientId: 'C1234',
    articles: [
      {
        productId: 'APPLE-1',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 12,
        price: 40
      },
      {
        productId: 'BANANA-4',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 4,
        price: 12
      },
      {
        productId: 'BEETROOT-150',
        brand: 'ARTIGO',
        categoryId: 'ROOT',
        quantity: 1,
        price: 3.50
      }
    ]
  },
  {
    id: 'CH-A14H1-ORD',
    date: new Date('2018-01-05'),
    clientId: 'C1234',
    articles: [
      {
        productId: 'TOMATO-1',
        brand: 'BORNIBUS',
        categoryId: 'VEGETABLE',
        quantity: 5,
        price: 32.75
      },
      {
        productId: 'BANANA-4',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 14,
        price: 17.85
      },
      {
        productId: 'POTATO-190',
        brand: 'ARTIGO',
        categoryId: 'ROOT',
        quantity: 250,
        price: 120
      }
    ]
  },
  {
    id: 'CH-A15H1-ORD',
    date: new Date('2018-02-05'),
    clientId: 'C1234',
    articles: [
      {
        productId: 'CAROTT-8',
        brand: 'ARTIGO',
        categoryId: 'VEGETABLE',
        quantity: 82,
        price: 910.32
      },
      {
        productId: 'ORANGE-891',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 9,
        price: 102.89
      },
      {
        productId: 'GINSENG-1',
        brand: 'EPINOOS',
        categoryId: 'ROOT',
        quantity: 8,
        price: 52.24
      }
    ]
  },
  {
    id: 'CH-A16H1-ORD',
    date: new Date('2017-12-05'),
    clientId: 'C5678',
    articles: [
      {
        productId: 'APPLE-1',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 82,
        price: 910.32
      },
      {
        productId: 'ORANGE-891',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 9,
        price: 102.89
      },
      {
        productId: 'GINSENG-1',
        brand: 'EPINOOS',
        categoryId: 'ROOT',
        quantity: 8,
        price: 52.24
      }
    ]
  },
  {
    id: 'CH-A17H1-ORD',
    date: new Date('2017-12-25'),
    clientId: 'C5678',
    articles: [
      {
        productId: 'APPLE-1',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 82,
        price: 910.32
      },
      {
        productId: 'ORANGE-891',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 9,
        price: 102.89
      },
      {
        productId: 'GINSENG-1',
        brand: 'EPINOOS',
        categoryId: 'ROOT',
        quantity: 8,
        price: 52.24
      }
    ]
  },
  {
    id: 'CH-A17H1-ORD',
    date: new Date('2018-02-17'),
    clientId: 'C5678',
    articles: [
      {
        productId: 'APPLE-1',
        brand: 'BORNIBUS',
        categoryId: 'FRUIT',
        quantity: 91,
        price: 901.32
      },
      {
        productId: 'CAROTT-891',
        brand: 'ARTIGO',
        categoryId: 'VEGETABLE',
        quantity: 3,
        price: 76.89
      },
      {
        productId: 'GINSENG-1',
        brand: 'EPINOOS',
        categoryId: 'ROOT',
        quantity: 8,
        price: 52.24
      }
    ]
  }
];

let kit;

test.before((t) => {
  kit = Kit.create({ token: process.env.CRAFT_TOKEN });
  return kit.destroy().then(() => kit.update(orders, 'all'));
});

test.after.always('guaranteed cleanup', (t) => {
  return kit.destroy();
});

test('Request BORNIBUS in JAN to FEB', (t) => {
  return kit.request(
    [['FRUIT', 'VEGETABLE']],
    'BORNIBUS',
    new Date('2018-01-05'),
    new Date('2018-02-05'),
    'interested'
  )
    .then((result) => {
      t.is(result.length, 3);
      t.is(result[0].query, 'BORNIBUS_FRUIT_VEGETABLE');
      t.is(result[1].query, 'FRUIT_VEGETABLE');
      t.is(result[2].query, 'BORNIBUS');
      t.log(JSON.stringify(result, null, 2));
      t.deepEqual(result[0].clients, []);
      t.deepEqual(_.sortBy(result[1].clients, ['clientId']), [
        {
          clientId: 'C1234',
          confidence: 0.6774609088897705
        },
        {
          clientId: 'C5678',
          confidence: 0.6774609088897705
        }
      ]);
      t.deepEqual(result[2].clients, []);
    });
});

test('Request PONHU in JAN to FEB', (t) => {
  return kit.request(
    [['MEAT', 'CEREAL']],
    'PONHU',
    new Date('2018-01-05'),
    new Date('2018-02-05'),
    'interested'
  )
    .then((result) => {
      t.is(result.length, 3);
      t.is(result[0].query, 'PONHU_MEAT_CEREAL');
      t.is(result[1].query, 'MEAT_CEREAL');
      t.is(result[2].query, 'PONHU');
      t.deepEqual(result[0].clients, []);
      t.deepEqual(result[1].clients, []);
      t.deepEqual(result[2].clients, []);
    });
});

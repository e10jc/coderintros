import React from 'react'
import {mount} from 'enzyme'

import Ad from '../../components/ad'

test('renders', () => {
  const component = mount(<Ad />)
  expect(component.length).toBeTruthy()
})

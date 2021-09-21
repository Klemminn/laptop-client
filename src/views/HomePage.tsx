import React, { useState } from 'react';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

import { Buttons, Header, LaptopList } from 'components';
import Sidebar from './Sidebar';
import { Laptop } from 'types';

const Container = styled.div`
  margin: 1rem 2rem;
`;

const HomePage: React.FC = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const toggleSidebar = () => setIsOpenSidebar(!isOpenSidebar);
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });

  return (
    <Sidebar
      open={isOpenSidebar}
      toggleSidebar={toggleSidebar}
      onFilterChange={setLaptops}
    >
      {isMobile && <Buttons.MenuButton onClick={toggleSidebar} />}
      <Header />
      <Container>
        <LaptopList laptops={laptops} />
      </Container>
    </Sidebar>
  );
};

export default HomePage;

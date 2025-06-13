import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-[75vh]">
      <StyledWrapper>
        <div className="loader">
          <div className="loader_cube loader_cube--color" />
          <div className="loader_cube loader_cube--glowing" />
        </div>
      </StyledWrapper></div>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 150px;
    height: 150px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader_cube {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 30px;
  }

  .loader_cube--glowing {
    z-index: 2;
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .loader_cube--color {
    z-index: 1;
    filter: blur(2px);
    background: linear-gradient(135deg, #1afbf0, #da00ff);
    animation: loadtwo 2.5s ease-in-out infinite;
  }

  @keyframes loadtwo {
    50% {
      transform: rotate(-80deg);
    }
  }`;

export default Loader;

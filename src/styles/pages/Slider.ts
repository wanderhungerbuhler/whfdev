import styled from 'styled-components';

export const SliderHome = styled.div`
  max-width: 1360px;
  width: 90%;
  margin: 150px auto;
  display: flex;
  justify-content: flex-start;

  .active { flex: 35%; }

  article {
    width: 210px;
    height: 500px;
    overflow: hidden;
    margin-right: 1rem;
    background: #0B0B0B;
    transition: all .5s ease-in-out;
    flex: 0 0 16%;
    position: relative;
    @media (max-width: 750px) {
      margin-top: 10px;
      flex: 33%;
    }
    display: flex;
    justify-content: space-around;
    align-items: center;

    &:hover { width: 430px; cursor: pointer; flex: 0 0 35%; left: 0;
      transition: all .5s ease-in-out;
    }

    &:nth-child(5) {
      h1 { font-size: 3rem; color:#fff; }
      p { font-size: 1.75rem; color: #fff; }
      @media (max-width: 750px) {
        flex: 100%;
      }
    }
    &:nth-child(5) p { display: none; }
    &:nth-child(5):hover h1 { display: none;  }
    &:nth-child(5):hover p { display: block; padding: 30px; opacity: 1; }
    &:nth-child(5):hover p::before {
      content: "";
      width: 50px;
      height: 50px;
      background: url('/images/icon-arrow-scroll') no-repeat center center;
      background-size: 100%;
      transform: rotate(90deg);
      display: block;
      position: absolute;
      top: 20px;
      right: 20px;
    }
    &:nth-child(5):hover p::after {
      content: "";
      width: 50px;
      height: 50px;
      background: url('/images/icon-arrow-scroll') no-repeat center center;
      background-size: 100%;
      transform: rotate(-90deg);
      display: block;
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
  @media (max-width: 750px) {
    margin-top: 150px;
    flex-wrap: wrap;
  }
`;

export const SliderDecription = styled.div`
  position: absolute;
  padding: 20px;
  color: #fff;
  z-index: 1000;
  bottom: 40px;
  span { text-transform: uppercase; font-size: 1.4rem; }
  p { font-size: 1.2rem; margin-top: 10px; }
`;

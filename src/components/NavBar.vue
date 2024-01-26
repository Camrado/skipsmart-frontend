<template>
  <nav role="navigation">
    <div id="menuToggle">
      <input type="checkbox" />
      <span></span>
      <span></span>
      <span></span>
      <ul id="menu">
        <li><RouterLink to="/">Home</RouterLink></li>
        <!-- <li><RouterLink to="/contact">Contact</RouterLink></li> -->
        <br /><br />
        <hr />
        <li><RouterLink to="/login">Sign In</RouterLink></li>
        <li><RouterLink to="/register">Sign Up</RouterLink></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #1e1e23;
  opacity: 1;
  font-size: 1.5em;
  font-weight: 400;
  transition: 200ms;
}
a:hover {
  opacity: 0.5;
}
ul {
  padding: 0;
  list-style-type: none;
}
nav {
  background-color: #121629;
  height: 60px;
  padding: 22px;
  position: sticky;
  top: -1px;
  width: 100vw;
  z-index: 1000000;
}

#menuToggle {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
  -webkit-user-select: none;
  user-select: none;
}

#menuToggle input {
  display: flex;
  width: 29px;
  height: 21px;
  position: absolute;
  cursor: pointer;
  opacity: 0;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#menuToggle span {
  display: flex;
  width: 29px;
  height: 2px;
  margin-bottom: 5px;
  position: relative;
  background: #b8c1ec;
  border-radius: 3px;
  z-index: 1;
  transform-origin: 5px 0px;
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    opacity 0.55s ease;
}

#menuToggle span:first-child {
  transform-origin: 0% 0%;
}

#menuToggle span:nth-last-child(2) {
  transform-origin: 0% 100%;
}

#menuToggle input:checked ~ span {
  opacity: 1;
  transform: rotate(45deg) translate(-3px, -1px);
  background: #36383f;
}
#menuToggle input:checked ~ span:nth-last-child(3) {
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}

#menuToggle input:checked ~ span:nth-last-child(2) {
  transform: rotate(-45deg) translate(0, -1px);
}

#menu {
  position: fixed;
  width: 100vw;
  height: 101vh;
  box-shadow: 0 0 10px #ffffff;
  top: 0;
  left: 0;
  padding: 50px;
  padding-top: 125px;
  background-color: #fffffe;
  -webkit-font-smoothing: antialiased;
  transform-origin: 0% 0%;
  transform: translate(-110%, 0);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
}

#menu li {
  padding: 10px 0;
  transition-delay: 2s;
}

#menuToggle input:checked ~ ul {
  transform: none;
}
</style>

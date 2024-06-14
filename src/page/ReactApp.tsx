function ReactApp() {
  return (
    <>
      <div>ReactApp</div>
      <micro-app
        name="react-project"
        url="//localhost:10000"
        baseroute="/react"
        data-testidset="test"
      />
    </>
  );
}

export default ReactApp;

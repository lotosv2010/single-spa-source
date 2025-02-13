let root = null;

export const bootstrap = (props) => {
  console.log('app2 bootstrap');
  return Promise.resolve()
  .then(() => {
    root = document.querySelector('#sub_app');
  });
}

export const mount = (props) => {
  console.log('app2 mount');
  return Promise.resolve()
  .then(() => {
    const div = document.createElement('div');
    div.innerHTML = 'Hello from app2';
    root.appendChild(div);
  });
}

export const unmount = (props) => {
  console.log('app2 unmount');
  return Promise.resolve()
  .then(() => {
    root.innerHTML = '';
  });
}
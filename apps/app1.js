let root = null;

export const bootstrap = async () => {
  console.log('app1 bootstrap');
  root = document.querySelector('#sub_app');
}


export const mount = async () => {
  console.log('app1 mount');
  const div = document.createElement('div');
  div.innerHTML = 'Hello from app1';
  root.appendChild(div);
}

export const unmount = async () => {
  console.log('app1 unmount');
  root.innerHTML = '';
}
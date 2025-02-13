let root = null;

export const bootstrap = [
  async(props) => {
    console.log('app1 bootstrap');
    root = document.querySelector('#sub_app');
  },
  async(props) => {
    console.log('app1 bootstrap 2');
  },
]

export const mount = async (props) => {
  console.log('app1 mount');
  const div = document.createElement('div');
  div.innerHTML = 'Hello from app1';
  root.appendChild(div);
}

export const unmount = async (props) => {
  console.log('app1 unmount');
  root.innerHTML = '';
}
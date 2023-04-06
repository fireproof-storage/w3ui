export function FireproofMenu() {
  return (
    <header class="bg-gray-800 py-4 px-5 flex items-center justify-between">
      <a href="https://fireproof.storage/">
        <img
          src="https://fireproof.storage/static/img/logo-animated.svg"
          alt="Fireproof Logo"
          style="height: 64px; width: auto; padding-right:0.5em" />
      </a>
      <nav class="nav-menu text-white">
        <ul class="flex">
          <li class="mr-6">
            <a href="https://fireproof.storage/developer/">Docs</a>
          </li>
          <li class="mr-6">
            <a href="https://fireproof.storage/blog/">Blog</a>
          </li>
          <li class="mr-6">
            <a href="https://fireproof.storage/thanks/">Community</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

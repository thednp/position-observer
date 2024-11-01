const copyToClipboard = (
  e: MouseEvent & { currentTarget: HTMLButtonElement; target: Element },
) => {
  console.log(this, e)
  const btn = e.target.closest("button") as HTMLButtonElement;
  if (btn) {
    const textContent = btn.textContent?.trim() as string;
    const cli = btn.dataset.cli;
    const [pm] = textContent.split(/\s/);
    navigator.clipboard.writeText(cli!);
    alert(`${pm} installation CLI was copied to clipboard`);
  }
};

export default copyToClipboard;

export default function getMarkup() {
    const markup = `<div class="container" style="padding: 40vh 3rem; margin: 40vh 0">
      <h3>PositionObserver Example</h3>
      <div class="btn-toolbar mb-3">
        <button type="button" class="btn btn-warning me-1 mb-1" data-test="tooltip">Click</button>
      </div>
      <div>
        <div class="tooltip position-fixed fade bs-tooltip-top show" role="tooltip" id="tooltip-46" style="top: 0px; left: 0px;">
            <div class="tooltip-arrow position-absolute" style="left: 93.5px;"></div>
                <div class="tooltip-inner">
                    <b>Manual Tooltip</b>
                    <span class="badge bg-success">NEW</span><br>
                    Perhaps adding even more content would make the job more difficult? Nope, same as if this was a very very short tooltip. Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time schemas.
                </div>
            </div>
        </div>
    </div>`;
    const domParser = new DOMParser();
    let tempDocument = domParser.parseFromString(markup, "text/html");
    const container = tempDocument.querySelector("div")!;

    return container;
}
const SvgLogo = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 140 36"
    width={props.width || 140}
    height={props.height || 36}
    fill="none"
    {...props}
  >
    <path
      fill="#2E7FF8"
      d="m119.617 27.04-6.176-15.36h3.648l4.16 11.168-1.088.032 4.064-11.2h2.048l4.064 11.2-1.088-.032 4.16-11.168h3.648l-6.176 15.36h-2.048l-4.16-10.624h1.152l-4.16 10.624zM104.286 27.36q-2.08 0-3.776-1.056-1.665-1.056-2.656-2.848-.96-1.824-.96-4.064 0-2.273.96-4.064.992-1.824 2.656-2.88 1.696-1.088 3.776-1.088 1.76 0 3.104.768a5.6 5.6 0 0 1 2.176 2.048q.8 1.312.8 2.976v4.416q0 1.664-.8 2.976a5.6 5.6 0 0 1-2.144 2.08q-1.376.736-3.136.736m.576-3.328q1.952 0 3.136-1.312 1.216-1.312 1.216-3.36 0-1.377-.544-2.432a3.9 3.9 0 0 0-1.536-1.632q-.96-.608-2.272-.608-1.28 0-2.272.608-.96.576-1.536 1.632-.544 1.056-.544 2.432t.544 2.432a4.45 4.45 0 0 0 1.536 1.664q.992.576 2.272.576m4.128 3.008v-4.128l.608-3.744-.608-3.712V11.68h3.52v15.36zM91.697 27.04V4h3.52v23.04zM77.893 27.36q-2.304 0-4.16-1.024a8 8 0 0 1-2.912-2.88q-1.056-1.824-1.056-4.096t1.056-4.064a7.85 7.85 0 0 1 2.848-2.88q1.824-1.056 4.032-1.056 2.144 0 3.776.992a6.9 6.9 0 0 1 2.592 2.72q.96 1.728.96 3.936 0 .384-.064.8a8 8 0 0 1-.128.864H72.229v-2.88h10.784L81.7 18.944q-.064-1.408-.544-2.368a3.4 3.4 0 0 0-1.376-1.472q-.864-.512-2.144-.512-1.344 0-2.336.576a3.9 3.9 0 0 0-1.536 1.632q-.544 1.024-.544 2.464t.576 2.528q.576 1.087 1.632 1.696 1.055.576 2.432.576 1.183 0 2.176-.416a4.54 4.54 0 0 0 1.728-1.216l2.24 2.272a7.2 7.2 0 0 1-2.72 1.984 8.7 8.7 0 0 1-3.392.672M64.6 27.04V4h3.52v23.04zM55.54 27.36q-1.76 0-3.135-.736a5.8 5.8 0 0 1-2.176-2.08q-.768-1.313-.768-2.976v-4.416q0-1.665.8-2.976a5.6 5.6 0 0 1 2.176-2.048q1.376-.768 3.104-.768 2.079 0 3.744 1.088 1.695 1.056 2.656 2.88.992 1.793.992 4.064 0 2.24-.992 4.064a7.4 7.4 0 0 1-2.656 2.848Q57.62 27.36 55.54 27.36m-8.223 6.08V11.68h3.52v4.128l-.608 3.744.608 3.712V33.44zm7.648-9.408q1.28 0 2.24-.576a4.13 4.13 0 0 0 1.536-1.664q.576-1.056.576-2.432 0-1.377-.576-2.432a3.9 3.9 0 0 0-1.536-1.632q-.96-.608-2.24-.608t-2.272.608a3.9 3.9 0 0 0-1.536 1.632q-.544 1.056-.544 2.432t.544 2.432a4.13 4.13 0 0 0 1.536 1.664q.991.576 2.272.576M21.034 27.04V11.68h3.52v15.36zm10.208 0v-9.152q0-1.537-.96-2.368-.96-.864-2.368-.864-.96 0-1.728.384-.735.384-1.184 1.12-.448.704-.448 1.728l-1.376-.768q0-1.76.768-3.04a5.3 5.3 0 0 1 2.08-1.984q1.312-.735 2.944-.736 1.633 0 2.944.704a5.3 5.3 0 0 1 2.08 1.984q.768 1.28.768 3.072v9.92zm10.208 0v-9.152q0-1.537-.96-2.368-.96-.864-2.368-.864-.927 0-1.696.384t-1.216 1.12q-.448.704-.448 1.728l-1.984-.768q.16-1.76 1.024-3.04a6 6 0 0 1 2.208-1.984 6.3 6.3 0 0 1 3.008-.736q1.664 0 3.008.704t2.144 1.984.8 3.072v9.92zM14.846 27.04V11.68h3.52v15.36zm1.76-18.176q-.896 0-1.504-.608-.576-.608-.576-1.504t.576-1.504q.609-.608 1.504-.608.928 0 1.504.608t.576 1.504-.576 1.504-1.504.608M7.368 27.36a9.4 9.4 0 0 1-2.464-.32 9 9 0 0 1-2.176-.96A7.4 7.4 0 0 1 1 24.544l2.24-2.24a5.5 5.5 0 0 0 1.824 1.408q1.056.448 2.368.448 1.185 0 1.792-.352.608-.352.608-1.024 0-.704-.576-1.088t-1.504-.64a55 55 0 0 0-1.92-.576 10.6 10.6 0 0 1-1.92-.768 4.3 4.3 0 0 1-1.472-1.376q-.576-.864-.576-2.24 0-1.473.672-2.528.705-1.056 1.952-1.632 1.28-.576 3.04-.576 1.856 0 3.264.672a5.9 5.9 0 0 1 2.4 1.952l-2.24 2.24q-.672-.832-1.536-1.248t-1.984-.416q-1.056 0-1.632.32t-.576.928q0 .64.576.992t1.472.608q.929.255 1.92.576 1.024.288 1.92.832.928.511 1.504 1.408.576.864.576 2.272 0 2.24-1.568 3.552T7.368 27.36"
    />
  </svg>
);
export default SvgLogo;

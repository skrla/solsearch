export default function TokenData() {
  return (
    <div className="flex flex-col p-5 items-center">
      <div className="flex p-2 items-center justify-start">
        <img src="" alt="token icon" />
        <h2>NAZIV TOKENA</h2>
        <h3>VRSTA TOKENA</h3>
        <h4>ADRESA TOKENA</h4>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>Trenutni supply</p>
        <p> supply</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>DECIMALE</p>
        <p> decimale</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>TOKEN EXT</p>
        <p> extension</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>TOKEN OWNER</p>
        <p>owner</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>UPDATE AUTHORITY</p>
        <p> update</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>MINT AUTHORITY</p>
        <p> mint</p>
      </div>
      <div className="flex p-2 items-center justify-between">
        <p>FREZZE AUTHORITY</p>
        <p>frezze</p>
      </div>
    </div>
  );
}

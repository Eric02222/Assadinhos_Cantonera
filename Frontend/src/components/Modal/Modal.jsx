const ModalReserva = ({ open, onClose, title, children, onSave }) => {
  if (!open) return null;

  return (
    <>
      <div  onClick={onClose} />

      <div
        tabIndex={-1}
        role="dialog"
        style={{ display: "block" }}
        aria-hidden={!open}
        onClick={onClose}
      >
        <div c role="document" onClick={(e) => e.stopPropagation()}>
          <div >
            <div >
              <h5 >{title}</h5>
              <button type="button"  aria-label="Close" onClick={onClose} />
            </div>

            <div >
              {children}
            </div>

            <div >
              <button type="button"  onClick={onClose}>
                Fechar
              </button>
              <button type="button"  onClick={onSave}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalReserva;
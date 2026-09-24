import type { ReactNode } from "react";
import { services } from "../../data/site";
import {
  FACADE_TYPES,
  GLAZING_TYPES,
  MOVE_EXTRAS,
  MOVE_SIZES,
  PEST_MODES,
  PEST_PLACES,
  SIZES,
  TYRE_TYPES,
  WASTE_AMOUNTS,
  WASTE_TYPES,
} from "./options";
import { FieldError, NumberStepper, SelectCard } from "./Controls";
import { TextField } from "../ui/Field";
import type {
  FacadeKey,
  FieldErrors,
  GlazingType,
  MoveExtraKey,
  MoveSizeKey,
  PestModeKey,
  PestPlaceKey,
  QuoteData,
  ServiceId,
  SizeKey,
  TyreKey,
  WasteAmountKey,
  WasteKey,
} from "./types";

type Props = {
  data: QuoteData;
  update: (patch: Partial<QuoteData>) => void;
  errors: FieldErrors;
};

/* Każda wybrana usługa dostaje własny blok. Przy jednej usłudze krok jest
   krótki, przy kilku po prostu dłuższy, ale nadal czytelny: nagłówek
   z ikoną oddziela sekcje. */
function ServiceBlock({ id, children }: { id: ServiceId; children: ReactNode }) {
  const service = services.items.find((s) => s.id === id);
  if (!service) return null;
  const Icon = service.icon;

  return (
    <section className="border-t border-line pt-7 first:border-t-0 first:pt-0">
      <h4 className="flex items-center gap-2.5 text-[0.9375rem] font-bold text-ink">
        <span className="flex h-8 w-8 items-center justify-center rounded-control bg-accent-soft text-accent">
          <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        </span>
        {service.name}
      </h4>
      <div className="mt-5 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Legend({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <>
      <legend className="text-[0.8125rem] font-semibold text-ink">{children}</legend>
      {hint ? <p className="body-text mt-1.5 text-[0.8125rem]">{hint}</p> : null}
    </>
  );
}

/** Wspólny układ dla grup kart wyboru. */
function CardGrid({ children }: { children: ReactNode }) {
  return <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function StepDetails({ data, update, errors }: Props) {
  const toggle = <T extends string>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div className="flex flex-col gap-8">
      {/* ------------------------------------------------ mycie okien */}
      {data.services.includes("mycie-okien") ? (
        <ServiceBlock id="mycie-okien">
          <fieldset>
            <Legend hint="Można zaznaczyć kilka pozycji.">Rodzaj przeszkleń</Legend>
            <CardGrid>
              {GLAZING_TYPES.map((option) => (
                <SelectCard
                  key={option.value}
                  type="checkbox"
                  name="glazingTypes"
                  value={option.value}
                  checked={data.glazingTypes.includes(option.value)}
                  onChange={() =>
                    update({ glazingTypes: toggle(data.glazingTypes, option.value as GlazingType) })
                  }
                  title={option.label}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
            <FieldError>{errors.glazingTypes}</FieldError>
          </fieldset>

          <div>
            <span className="text-[0.8125rem] font-semibold text-ink">Liczba szyb lub witryn</span>
            <p className="body-text mt-1.5 text-[0.8125rem]">
              Nie wiesz, ile masz szyb? Nie szkodzi, podaj orientacyjną liczbę.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <NumberStepper
                id="ilosc-szyb"
                label="Liczba szyb lub witryn"
                value={data.quantity ?? 10}
                onChange={(next) => update({ quantity: next })}
                min={1}
                max={500}
                disabled={data.quantity === null}
              />
              <label className="flex cursor-pointer items-center gap-2.5 text-[0.9375rem] font-medium text-ink">
                <input
                  type="checkbox"
                  checked={data.quantity === null}
                  onChange={(e) => update({ quantity: e.target.checked ? null : 10 })}
                  className="h-5 w-5 shrink-0 rounded-[6px] border-2 border-line-strong accent-accent"
                />
                Nie wiem / trudno określić
              </label>
            </div>
          </div>

          <fieldset>
            <Legend>Orientacyjny rozmiar</Legend>
            <CardGrid>
              {SIZES.map((option) => (
                <SelectCard
                  key={option.value}
                  name="size"
                  value={option.value}
                  checked={data.size === option.value}
                  onChange={() => update({ size: option.value as SizeKey })}
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
            <FieldError>{errors.size}</FieldError>
          </fieldset>
        </ServiceBlock>
      ) : null}

      {/* --------------------------------------------- mycie elewacji */}
      {data.services.includes("mycie-elewacji") ? (
        <ServiceBlock id="mycie-elewacji">
          <fieldset>
            <Legend hint="Od materiału zależy dobór ciśnienia i środków.">Rodzaj elewacji</Legend>
            <CardGrid>
              {FACADE_TYPES.map((option) => (
                <SelectCard
                  key={option.value}
                  name="facadeType"
                  value={option.value}
                  checked={data.facadeType === option.value}
                  onChange={() => update({ facadeType: option.value as FacadeKey })}
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
            <FieldError>{errors.facadeType}</FieldError>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Szacowana powierzchnia"
              placeholder="np. 120 m²"
              optional
              value={data.facadeArea}
              onChange={(e) => update({ facadeArea: e.target.value })}
            />
            <TextField
              label="Liczba kondygnacji"
              placeholder="np. 2"
              optional
              value={data.facadeFloors}
              onChange={(e) => update({ facadeFloors: e.target.value })}
            />
          </div>
        </ServiceBlock>
      ) : null}

      {/* ----------------------------------------------- deratyzacja */}
      {data.services.includes("deratyzacja") ? (
        <ServiceBlock id="deratyzacja">
          <fieldset>
            <Legend>Rodzaj obiektu</Legend>
            <CardGrid>
              {PEST_PLACES.map((option) => (
                <SelectCard
                  key={option.value}
                  name="pestPlace"
                  value={option.value}
                  checked={data.pestPlace === option.value}
                  onChange={() => update({ pestPlace: option.value as PestPlaceKey })}
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
            <FieldError>{errors.pestPlace}</FieldError>
          </fieldset>

          <fieldset>
            <Legend>Zakres obsługi</Legend>
            <CardGrid>
              {PEST_MODES.map((option) => (
                <SelectCard
                  key={option.value}
                  name="pestMode"
                  value={option.value}
                  checked={data.pestMode === option.value}
                  onChange={() => update({ pestMode: option.value as PestModeKey })}
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
          </fieldset>

          <TextField
            label="Metraż"
            placeholder="np. 60 m²"
            optional
            wrapClassName="sm:max-w-xs"
            value={data.pestArea}
            onChange={(e) => update({ pestArea: e.target.value })}
          />
        </ServiceBlock>
      ) : null}

      {/* ---------------------------------------------- przeprowadzki */}
      {data.services.includes("przeprowadzki") ? (
        <ServiceBlock id="przeprowadzki">
          <fieldset>
            <Legend>Co przewozimy</Legend>
            <CardGrid>
              {MOVE_SIZES.map((option) => (
                <SelectCard
                  key={option.value}
                  name="moveSize"
                  value={option.value}
                  checked={data.moveSize === option.value}
                  onChange={() => update({ moveSize: option.value as MoveSizeKey })}
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
            <FieldError>{errors.moveSize}</FieldError>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Skąd"
              placeholder="miasto, ulica, piętro"
              optional
              value={data.moveFrom}
              onChange={(e) => update({ moveFrom: e.target.value })}
            />
            <TextField
              label="Dokąd"
              placeholder="miasto, ulica, piętro"
              optional
              value={data.moveTo}
              onChange={(e) => update({ moveTo: e.target.value })}
            />
          </div>

          <fieldset>
            <Legend hint="Zaznacz, jeśli mamy się tym zająć.">Dodatkowo</Legend>
            <CardGrid>
              {MOVE_EXTRAS.map((option) => (
                <SelectCard
                  key={option.value}
                  type="checkbox"
                  name="moveExtras"
                  value={option.value}
                  checked={data.moveExtras.includes(option.value)}
                  onChange={() =>
                    update({ moveExtras: toggle(data.moveExtras, option.value as MoveExtraKey) })
                  }
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
          </fieldset>
        </ServiceBlock>
      ) : null}

      {/* ----------------------------------------- utylizacja odpadów */}
      {data.services.includes("utylizacja-odpadow") ? (
        <ServiceBlock id="utylizacja-odpadow">
          <fieldset>
            <Legend hint="Można zaznaczyć kilka pozycji.">Rodzaj odpadów</Legend>
            <CardGrid>
              {WASTE_TYPES.map((option) => (
                <SelectCard
                  key={option.value}
                  type="checkbox"
                  name="wasteTypes"
                  value={option.value}
                  checked={data.wasteTypes.includes(option.value)}
                  onChange={() =>
                    update({ wasteTypes: toggle(data.wasteTypes, option.value as WasteKey) })
                  }
                  title={option.label}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
            <FieldError>{errors.wasteTypes}</FieldError>
          </fieldset>

          <fieldset>
            <Legend>Szacowana ilość</Legend>
            <CardGrid>
              {WASTE_AMOUNTS.map((option) => (
                <SelectCard
                  key={option.value}
                  name="wasteAmount"
                  value={option.value}
                  checked={data.wasteAmount === option.value}
                  onChange={() => update({ wasteAmount: option.value as WasteAmountKey })}
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
          </fieldset>
        </ServiceBlock>
      ) : null}

      {/* -------------------------------------------- utylizacja opon */}
      {data.services.includes("utylizacja-opon") ? (
        <ServiceBlock id="utylizacja-opon">
          <fieldset>
            <Legend hint="Można zaznaczyć kilka pozycji.">Rodzaj opon</Legend>
            <CardGrid>
              {TYRE_TYPES.map((option) => (
                <SelectCard
                  key={option.value}
                  type="checkbox"
                  name="tyreTypes"
                  value={option.value}
                  checked={data.tyreTypes.includes(option.value)}
                  onChange={() =>
                    update({ tyreTypes: toggle(data.tyreTypes, option.value as TyreKey) })
                  }
                  title={option.label}
                  body={option.hint}
                  icon={option.icon}
                />
              ))}
            </CardGrid>
            <FieldError>{errors.tyreTypes}</FieldError>
          </fieldset>

          <div>
            <span className="text-[0.8125rem] font-semibold text-ink">Liczba opon</span>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
              <NumberStepper
                id="ilosc-opon"
                label="Liczba opon"
                value={data.tyreCount}
                onChange={(next) => update({ tyreCount: next })}
                min={1}
                max={2000}
              />
              <label className="flex cursor-pointer items-center gap-2.5 text-[0.9375rem] font-medium text-ink">
                <input
                  type="checkbox"
                  checked={data.tyreOnRims}
                  onChange={(e) => update({ tyreOnRims: e.target.checked })}
                  className="h-5 w-5 shrink-0 rounded-[6px] border-2 border-line-strong accent-accent"
                />
                Opony na felgach
              </label>
            </div>
            <FieldError>{errors.tyreCount}</FieldError>
          </div>
        </ServiceBlock>
      ) : null}
    </div>
  );
}

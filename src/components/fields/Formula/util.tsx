import { useMemo, useRef } from "react";
import { isEqual } from "lodash-es";

import { FieldType } from "@src/constants/fields";

import ShortTextDisplayCell from "@src/components/fields/ShortText/DisplayCell";
import LongTextDisplayCell from "@src/components/fields/LongText/DisplayCell";
import RichTextDisplayCell from "@src/components/fields/RichText/DisplayCell";
import UrlDisplayCell from "@src/components/fields/Url/DisplayCell";
import NumberDisplayCell from "@src/components/fields/Number/DisplayCell";
import CheckboxDisplayCell from "@src/components/fields/Checkbox/DisplayCell";
import PercentageDisplayCell from "@src/components/fields/Percentage/DisplayCell";
import RatingDisplayCell from "@src/components/fields/Rating/DisplayCell";
import SliderDisplayCell from "@src/components/fields/Slider/DisplayCell";
import ColorDisplayCell from "@src/components/fields/Color/DisplayCell";
import GeoPointDisplayCell from "@src/components/fields/GeoPoint/DisplayCell";
import DateDisplayCell from "@src/components/fields/Date/DisplayCell";
import DateTimeDisplayCell from "@src/components/fields/DateTime/DisplayCell";
import ImageDisplayCell from "@src/components/fields/Image/DisplayCell";
import FileDisplayCell from "@src/components/fields/File/DisplayCell";
import JsonDisplayCell from "@src/components/fields/Json/DisplayCell";
import CodeDisplayCell from "@src/components/fields/Code/DisplayCell";
import MarkdownDisplayCell from "@src/components/fields/Markdown/DisplayCell";
import CreatedByDisplayCell from "@src/components/fields/CreatedBy/DisplayCell";

export function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>(value);
  const signalRef = useRef<number>(0);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ref.current, [signalRef.current]);
}

export const listenerFieldTypes = Object.values(FieldType).filter(
  (type) =>
    ![
      FieldType.action,
      FieldType.status,
      FieldType.formula,
      FieldType.aggregate,
      FieldType.connectService,
      FieldType.connectTable,
      FieldType.connector,
      FieldType.subTable,
      FieldType.reference,
      FieldType.last,
    ].includes(type)
);

export const outputFieldTypes = Object.values(FieldType).filter(
  (type) =>
    ![
      FieldType.formula,
      FieldType.derivative,
      FieldType.action,
      FieldType.status,
      FieldType.aggregate,
      FieldType.connectService,
      FieldType.connectTable,
      FieldType.connector,
      FieldType.duration,
      FieldType.subTable,
      FieldType.reference,
      FieldType.createdAt,
      FieldType.createdBy,
      FieldType.updatedAt,
      FieldType.updatedBy,
      FieldType.last,
    ].includes(type)
);

export const typeDefs = (type: FieldType) => {
  switch (type) {
    case FieldType.shortText:
    case FieldType.longText:
    case FieldType.richText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.singleSelect:
      return "string | undefined";
    case FieldType.multiSelect:
      return "Array | undefined";
    case FieldType.number:
    case FieldType.rating:
    case FieldType.slider:
    case FieldType.percentage:
      return "number | undefined";
    case FieldType.checkbox:
      return "boolean | undefined";
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.duration:
      return "{ seconds: number; nanoseconds: number; }";
  }
  return "any";
};

export const getDisplayCell = (type: FieldType) => {
  switch (type) {
    case FieldType.longText:
      return LongTextDisplayCell;
    case FieldType.richText:
      return RichTextDisplayCell;
    case FieldType.url:
      return UrlDisplayCell;
    case FieldType.number:
      return NumberDisplayCell;
    case FieldType.checkbox:
      return CheckboxDisplayCell;
    case FieldType.percentage:
      return PercentageDisplayCell;
    case FieldType.rating:
      return RatingDisplayCell;
    case FieldType.slider:
      return SliderDisplayCell;
    case FieldType.color:
      return ColorDisplayCell;
    case FieldType.geoPoint:
      return GeoPointDisplayCell;
    case FieldType.date:
      return DateDisplayCell;
    case FieldType.dateTime:
      return DateTimeDisplayCell;
    case FieldType.image:
      return ImageDisplayCell;
    case FieldType.file:
      return FileDisplayCell;
    case FieldType.json:
      return JsonDisplayCell;
    case FieldType.code:
      return CodeDisplayCell;
    case FieldType.markdown:
      return MarkdownDisplayCell;
    case FieldType.createdBy:
      return CreatedByDisplayCell;
    default:
      // FieldType url, email, phone, singleSelect, multiSelect
      return ShortTextDisplayCell;
  }
};